import React from 'react';
import { cn } from '../lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { type ProductFilters } from '../hooks/useProducts';
import { isFeatureEnabled } from '../lib/feature-flags';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  categories: string[];
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  className
}) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category });
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    onFiltersChange({ [field]: numValue });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ search });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'Tất cả',
      priceMin: 0,
      priceMax: 1000000,
      search: ''
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search - Only show if bonus features enabled */}
      {isFeatureEnabled('ENABLE_SEARCH') && (
        <div className="space-y-2">
          <Label htmlFor="product-search">Tìm kiếm sản phẩm</Label>
          <Input
            id="product-search"
            placeholder="Nhập tên sản phẩm..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* Category Filter - Always show */}
      <div className="space-y-3">
        <Label>Danh mục</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-3 py-2 text-sm rounded-md border transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "focus:ring-offset-background",
                filters.category === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter - Only show if bonus features enabled */}
      {isFeatureEnabled('ENABLE_PRICE_RANGE') && (
        <div className="space-y-3">
          <Label>Khoảng giá</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="price-min" className="text-xs text-muted-foreground">
                Từ
              </Label>
              <Input
                id="price-min"
                type="number"
                placeholder="0"
                value={filters.priceMin || ''}
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                className="w-full"
                min="0"
              />
              <span className="text-xs text-muted-foreground">
                {formatPrice(filters.priceMin)}
              </span>
            </div>
            <div className="space-y-1">
              <Label htmlFor="price-max" className="text-xs text-muted-foreground">
                Đến
              </Label>
              <Input
                id="price-max"
                type="number"
                placeholder="1000000"
                value={filters.priceMax || ''}
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                className="w-full"
                min="0"
              />
              <span className="text-xs text-muted-foreground">
                {formatPrice(filters.priceMax)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters Button - Only show if bonus features enabled */}
      {isFeatureEnabled('ENABLE_SEARCH') || isFeatureEnabled('ENABLE_PRICE_RANGE') ? (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="w-full"
        >
          Xóa bộ lọc
        </Button>
      ) : null}
    </div>
  );
};

export default ProductFilters;
