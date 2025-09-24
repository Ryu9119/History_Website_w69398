import React from 'react';

interface PageSkeletonProps {
  className?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Header skeleton */}
      <div className="h-16 bg-muted rounded mb-6"></div>
      
      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg p-6">
              <div className="h-48 bg-muted-foreground/20 rounded mb-4"></div>
              <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
