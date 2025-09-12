import Header from '../components/Header';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogFilters } from '@/components/BlogFilters';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useEffect, useRef } from 'react';

const Blog = () => {
  const { posts, isLoading, isError, selectedCategory, setSelectedCategory, clearFilters } = useBlogPosts();
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
  }, [selectedCategory, isLoading, isError]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6">
        {/* sr-only live region for loading announcements */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true">
          {isLoading ? 'Đang tải bài viết…' : ''}
        </div>
        <h1 className="text-2xl font-bold mb-4">Blog</h1>

        <div className="mb-6">
          <BlogFilters
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            onClear={clearFilters}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="w-full h-40 bg-muted animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState className="mt-4" onRetry={clearFilters} message="Không thể tải danh sách bài viết" />
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <EmptyState type="no-posts" className="mt-4" onClearFilters={clearFilters} />
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div
            ref={gridRef}
            id="blog-grid"
            tabIndex={-1}
            role="region"
            aria-label="Danh sách bài viết"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((p) => (
              <BlogPostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
