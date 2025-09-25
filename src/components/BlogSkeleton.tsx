import React from 'react';

interface BlogSkeletonProps {
  count?: number;
  className?: string;
}

const BlogSkeleton: React.FC<BlogSkeletonProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-muted"></div>
          <div className="p-6 space-y-4">
            <div className="h-5 bg-muted rounded w-16"></div>
            <div className="h-6 bg-muted rounded w-4/5"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <div className="h-3 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogSkeleton;

