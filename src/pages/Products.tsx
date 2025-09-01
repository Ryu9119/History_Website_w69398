import React, { useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductFilters from '../components/ProductFilters';
import ProductSort from '../components/ProductSort';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { Button } from '../components/ui/button';
import { useProducts } from '../hooks/useProducts';
import { cn } from '../lib/utils';
import { Filter, X } from 'lucide-react';
import { isFeatureEnabled } from '../lib/feature-flags';

const Products = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [mockError, setMockError] = useState(false);
  
  const {
    filteredProducts,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    isLoading,
    error,
    retry,
    categories,
    sortOptions
  } = useProducts();

  const handleClearFilters = () => {
    setFilters({
      category: 'Tất cả',
      priceMin: 0,
      priceMax: 1000000,
      search: ''
    });
  };

  const toggleMockError = () => {
    setMockError(!mockError);
  };

  // Show error state if mock error is enabled
  if (mockError) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Sản phẩm</h1>
            {isFeatureEnabled('ENABLE_MOCK_ERROR_TOGGLE') && (
              <Button onClick={toggleMockError} variant="outline">
                Tắt lỗi giả
              </Button>
            )}
          </div>
          <ErrorState 
            message="Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại."
            onRetry={retry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Sản phẩm</h1>
          <div className="flex items-center space-x-3">
            {isFeatureEnabled('ENABLE_MOCK_ERROR_TOGGLE') && (
              <Button onClick={toggleMockError} variant="outline" size="sm">
                Test Error
              </Button>
            )}
            {isFeatureEnabled('ENABLE_MOBILE_FILTER_TOGGLE') && (
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="md:hidden"
              >
                {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                <span className="ml-2">Bộ lọc</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={cn(
            "lg:w-80 space-y-6",
            isFeatureEnabled('ENABLE_MOBILE_FILTER_TOGGLE') 
              ? (showFilters ? "block" : "hidden md:block")
              : "block"
          )}>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <ProductSort
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  sortOptions={sortOptions}
                  className="w-full sm:w-48"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} sản phẩm
              </div>
            </div>

            {/* Content States */}
            {isLoading ? (
              // Loading State
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              // Error State
              <ErrorState message={error} onRetry={retry} />
            ) : filteredProducts.length === 0 ? (
              // Empty State
              <EmptyState 
                type="no-results" 
                onClearFilters={handleClearFilters}
              />
            ) : (
              // Products Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
