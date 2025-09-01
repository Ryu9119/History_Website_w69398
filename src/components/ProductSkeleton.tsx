import React from 'react';
import { cn } from '../lib/utils';

interface ProductSkeletonProps {
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-pulse",
        className
      )}
    >
      {/* Image Skeleton */}
      <div className="aspect-square bg-muted" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category and Rating Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-4 w-12 bg-muted rounded" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-4/5" />
        </div>

        {/* Price and Date Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-20 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-muted rounded-md mt-3" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
