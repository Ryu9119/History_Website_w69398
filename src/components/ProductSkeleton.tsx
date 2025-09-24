import React from 'react';

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-muted"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;