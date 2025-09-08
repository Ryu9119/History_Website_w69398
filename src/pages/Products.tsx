import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductFilters from '../components/ProductFilters';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/ui/pagination';
import { Button } from '../components/ui/button';
import { useProductsQuery, useProductCategoriesQuery } from '../hooks/useProductsQuery';
import { cn } from '../lib/utils';
import { Filter, X } from 'lucide-react';
import { isFeatureEnabled } from '../lib/feature-flags';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [mockError, setMockError] = useState(false);

  // Get URL params with defaults
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!, 10) : undefined;

  // React Query hooks
  const { data: productsData, isLoading, error, refetch } = useProductsQuery({
    page,
    limit,
    categoryId,
  });

  const { data: categories = ['Tất cả'] } = useProductCategoriesQuery();

  // Update URL params
  const updateURLParams = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filters change (except for page itself)
    if (newParams.page === undefined && Object.keys(newParams).some(k => k !== 'page')) {
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: Record<string, string | number | undefined>) => {
    updateURLParams(newFilters);
  };


  // Handle page change
  const handlePageChange = (newPage: number) => {
    updateURLParams({ page: newPage });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchParams({});
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
            onRetry={() => refetch()}
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
              filters={{
                category: categoryId ? categories[categoryId] || 'Tất cả' : 'Tất cả',
                search: '',
                priceMin: 0,
                priceMax: 1000000,
              }}
              onFiltersChange={handleFiltersChange}
              categories={categories}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-end">
              <div className="text-sm text-muted-foreground">
                {productsData?.data?.total || 0} sản phẩm
              </div>
            </div>

            {/* Content States */}
            {isLoading ? (
              // Loading State
              <div className="text-center py-8" role="status" aria-live="polite" aria-busy="true">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Đang tải sản phẩm...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                  {Array.from({ length: limit }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              </div>
            ) : error ? (
              // Error State
              <ErrorState onRetry={() => refetch()} />
            ) : !productsData?.data?.items.length ? (
              // Empty State
              <EmptyState 
                type="no-results" 
                onClearFilters={handleClearFilters}
              />
            ) : (
              // Products Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {productsData && productsData.data.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={productsData.data.page}
                  totalPages={productsData.data.totalPages}
                  totalItems={productsData.data.total}
                  itemsPerPage={productsData.data.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
