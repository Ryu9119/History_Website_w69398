import React, { useEffect, useRef } from 'react';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogFilters } from '@/components/BlogFilters';
import { Pagination } from '@/components/Pagination';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Search, AlertCircle } from 'lucide-react';

const Blog = () => {
  const { 
    posts, 
    isLoading, 
    isError, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery,
    setSearchQuery,
    clearFilters,
    currentPage,
    totalPages,
    totalPosts,
    goToPage,
    nextPage,
    prevPage
  } = useBlogPosts();
  
  const gridRef = useRef<HTMLDivElement | null>(null);
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  // When filter changes and content is ready, move focus to grid and scroll to top for SR-friendly UX
  useEffect(() => {
    if (!isLoading && !isError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Delay slightly to ensure DOM is painted
      const id = window.setTimeout(() => {
        gridRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [selectedCategory, searchQuery, isLoading, isError]);

  // Update live region for screen readers
  useEffect(() => {
    if (liveRegionRef.current) {
      if (isLoading) {
        liveRegionRef.current.textContent = 'Đang tải bài viết…';
      } else if (isError) {
        liveRegionRef.current.textContent = 'Có lỗi xảy ra khi tải bài viết';
      } else if (posts.length === 0) {
        liveRegionRef.current.textContent = 'Không tìm thấy bài viết nào';
      } else {
        liveRegionRef.current.textContent = `Hiển thị ${posts.length} bài viết trên trang ${currentPage} của ${totalPages} trang`;
      }
    }
  }, [isLoading, isError, posts.length, currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* sr-only live region for loading announcements */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blog lịch sử</h1>
          <p className="text-muted-foreground">
            Khám phá những câu chuyện lịch sử thú vị và những bài viết chuyên sâu
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <BlogFilters
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            onClear={clearFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Results Summary */}
        {!isLoading && !isError && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {totalPosts > 0 ? (
                <>
                  Hiển thị {posts.length} trong {totalPosts} bài viết
                  {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
                </>
              ) : (
                'Không tìm thấy bài viết nào'
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-16" />
                    <div className="h-3 bg-muted rounded animate-pulse w-20" />
                    <div className="h-3 bg-muted rounded animate-pulse w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-destructive" size={48} />
            <h2 className="text-xl font-semibold mb-2">Không thể tải danh sách bài viết</h2>
            <p className="text-muted-foreground mb-6">
              Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </p>
            <button
              onClick={clearFilters}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && posts.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài viết nào</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== 'Tất cả' 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Chưa có bài viết nào được đăng'
              }
            </p>
            {(searchQuery || selectedCategory !== 'Tất cả') && (
              <button
                onClick={clearFilters}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !isError && posts.length > 0 && (
          <>
            <div
              ref={gridRef}
              id="blog-grid"
              tabIndex={-1}
              role="region"
              aria-label="Danh sách bài viết"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  onPrevious={prevPage}
                  onNext={nextPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
