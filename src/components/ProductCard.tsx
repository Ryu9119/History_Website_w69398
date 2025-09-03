import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { type Product } from '../lib/mock-data';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={cn(
        "group bg-card border border-border rounded-lg shadow-sm overflow-hidden",
        "hover:shadow-md transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "focus-within:ring-offset-background",
        className
      )}
      tabIndex={0}
    >
      {/* Product Image */}
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <svg 
            className="w-16 h-16 text-muted-foreground/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-muted-foreground">{product.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price and Date */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(product.createdAt)}
          </span>
        </div>

        {/* Action Button */}
        <Link 
          to={`/products/${product.id}`}
          className={cn(
            "w-full mt-3 py-2 px-4 rounded-md font-medium transition-colors",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 focus:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "focus:ring-offset-background",
            "inline-block text-center"
          )}
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

