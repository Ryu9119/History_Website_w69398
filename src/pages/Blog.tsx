import Header from '../components/Header';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogFilters } from '@/components/BlogFilters';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const Blog = () => {
  const { posts, isLoading, isError, selectedCategory, setSelectedCategory, clearFilters } = useBlogPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Blog</h1>

        <div className="mb-6">
          <BlogFilters
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            onClear={clearFilters}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <ErrorState className="mt-4" onRetry={clearFilters} />
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <EmptyState type="no-blog-results" className="mt-4" onClearFilters={clearFilters} />
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
