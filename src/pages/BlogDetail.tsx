import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { usePostBySlugQuery } from '@/hooks/usePostBySlugQuery';
import { useRelatedPosts } from '@/hooks/useRelatedPosts';
import BlogContentRenderer from '@/components/BlogContentRenderer';
import RelatedPosts from '@/components/RelatedPosts';
import ErrorState from '@/components/ErrorState';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const mainContentRef = useRef<HTMLHeadingElement>(null);
  
  // Use new React Query hook
  const { 
    data: post, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = usePostBySlugQuery(slug || '');
  
  // Get related posts
  const relatedPosts = useRelatedPosts(post);
  
  // Focus management and scroll-to-top on slug change
  useEffect(() => {
    if (post && mainContentRef.current) {
      // Scroll to top
      window.scrollTo(0, 0);
      // Focus main heading for screen readers
      mainContentRef.current.focus();
    }
  }, [slug, post]);
  
  // Update document title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} – Lịch Sử Việt Nam`;
    } else {
      document.title = 'Lịch Sử Việt Nam';
    }
    
    // Cleanup on unmount
    return () => {
      document.title = 'Lịch Sử Việt Nam';
    };
  }, [post]);
  
  const retry = () => {
    // Remove error param in dev mode for smooth demo
    if (import.meta.env.DEV && window.location.search.includes('error=1')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Skeleton for header */}
            <div className="mb-8">
              <div className="h-6 bg-muted rounded w-24 mb-4 animate-pulse" />
              <div className="h-12 bg-muted rounded w-3/4 mb-6 animate-pulse" />
              <div className="flex gap-6 mb-6">
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
            </div>
            
            {/* Skeleton for cover image */}
            <div className="w-full h-96 bg-muted rounded-xl mb-8 animate-pulse" />
            
            {/* Skeleton for content */}
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <ErrorState onRetry={retry} />
        </div>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Không tìm thấy bài viết
            </h1>
            <p className="text-muted-foreground mb-8">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* sr-only live region for loading announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? 'Đang tải bài viết...' : ''}
      </div>
      
      {/* Back Button */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Blog</span>
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <header className="mb-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                <Tag className="w-4 h-4" />
                {post.category || 'Chưa phân loại'}
              </span>
            </div>

            {/* Title */}
            <h1 
              ref={mainContentRef}
              id="main-content"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              tabIndex={-1}
            >
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author || 'Tác giả'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.createdAt}>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Đang cập nhật'}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime || 5} phút đọc</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt || 'Đang cập nhật'}
            </p>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.coverUrl || '/images/placeholder-cover.svg'}
              alt={`Ảnh bìa: ${post.title}`}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-cover.svg';
              }}
            />
          </div>

          {/* Blog Content */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <BlogContentRenderer content={post.content} />
          </div>

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;


