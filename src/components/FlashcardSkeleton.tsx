import React from 'react';

interface FlashcardSkeletonProps {
  count?: number;
  className?: string;
}

const FlashcardSkeleton: React.FC<FlashcardSkeletonProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-muted"></div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </div>
            <div className="h-5 bg-muted rounded w-4/5"></div>
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-3 bg-muted rounded w-12"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardSkeleton;

