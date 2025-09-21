import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/mock-blog';
import { cn } from '@/lib/utils';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPost[];
  isLoading?: boolean;
  className?: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  posts, 
  isLoading = false,
  className 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Don't render if no posts and not loading
  if (!isLoading && (!posts || posts.length === 0)) {
    return null;
  }

  return (
    <section 
      className={cn("mt-12 pt-8 border-t border-border", className)}
      aria-labelledby="related-posts-heading"
    >
      <h2 
        id="related-posts-heading"
        className="text-2xl font-bold text-foreground mb-6"
      >
        Bài viết liên quan
      </h2>

      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:border-primary/20 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            >
              <Link 
                to={`/blog/${post.slug}`} 
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                aria-label={`Đọc bài viết: ${post.title}`}
              >
                <div className="w-full h-48 bg-muted overflow-hidden relative group">
                  <img
                    src={post.coverUrl || '/images/placeholder-cover.svg'}
                    alt={`Ảnh bìa: ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/placeholder-cover.svg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-6 flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background focus-visible:rounded-sm"
                  >
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime} phút</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Chưa có bài viết liên quan nào.
          </p>
        </div>
      )}
    </section>
  );
};

export default RelatedPosts;