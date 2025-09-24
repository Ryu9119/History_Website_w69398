import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductSort from '../components/ProductSort';
import ProductFilters from '../components/ProductFilters';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/ui/pagination';
import { Button } from '../components/ui/button';
import { useProductsQuery, useProductCategoriesQuery } from '../hooks/useProductsQuery';
import { getCategoryLabelById } from '../lib/products-adapter';
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

  // Sort handling via URL param
  const sortBy = searchParams.get('sort') || 'newest';
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'name', label: 'Tên (A→Z)' },
    { value: 'rating', label: 'Đánh giá' },
  ];

  const handleSortChange = useCallback((newSort: string) => {
    updateURLParams({ sort: newSort });
  }, [searchParams]);

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    if (!productsData?.data?.items) return [];
    
    return [...productsData.data.items].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [productsData?.data?.items, sortBy]);

  // Update URL params
  const updateURLParams = useCallback((newParams: Record<string, string | number | undefined>) => {
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
    // Scroll to top and focus grid after filter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timeoutId = setTimeout(() => {
      gridRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [searchParams, setSearchParams]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Record<string, string | number | undefined>) => {
    updateURLParams(newFilters);
  }, [updateURLParams]);


  // SR-friendly grid focus ref
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    updateURLParams({ page: newPage });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus grid for SR users after pagination
    const timeoutId = setTimeout(() => {
      gridRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [updateURLParams]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Error retry: clear ?error=1 then refetch
  const handleRetry = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('error');
    setSearchParams(params);
    refetch();
  }, [searchParams, setSearchParams, refetch]);

  const toggleMockError = () => {
    setMockError(!mockError);
  };

  // Show error state if mock error is enabled
  if (mockError) {
    return (
      <div className="min-h-screen bg-background text-foreground">
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
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      
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
                category: getCategoryLabelById(categoryId) || 'Tất cả',
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
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {productsData?.data?.total || 0} sản phẩm
              </div>
              <ProductSort
                sortBy={sortBy}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
                className="w-56"
              />
            </div>

            {/* Content States */}
            {isLoading ? (
              // Loading State
              <div className="text-center py-8" role="status" aria-live="polite" aria-busy="true">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Đang tải sản phẩm...</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
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
              <div
                ref={gridRef}
                tabIndex={-1}
                aria-label="Lưới sản phẩm"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {sortedProducts.map((product) => (
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
