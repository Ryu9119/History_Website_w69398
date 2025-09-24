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

  // Refs
  const gridRef = useRef<HTMLDivElement>(null);

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
    // Focus grid after filter changes
    const timeoutId = setTimeout(() => {
      gridRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [searchParams, setSearchParams]);

  const handleSortChange = useCallback((newSort: string) => {
    updateURLParams({ sort: newSort });
  }, [updateURLParams]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Record<string, string | number | undefined>) => {
    updateURLParams(newFilters);
  }, [updateURLParams]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    updateURLParams({ page: newPage });
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-red-900 text-white py-16 pt-24 flex items-center justify-center">
        <div className="text-center px-4 w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Sản phẩm của chúng tôi</h1>
          <p className="text-xl text-red-100 leading-relaxed max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm giáo dục độc đáo về lịch sử Việt Nam
          </p>
        </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Show error state if mock error is enabled */}
          {mockError ? (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">Sản phẩm</h2>
                {isFeatureEnabled('ENABLE_MOCK_ERROR_TOGGLE') && (
                  <Button onClick={toggleMockError} variant="outline">
                    Tắt lỗi giả
                  </Button>
                )}
              </div>
              <ErrorState onRetry={handleRetry} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Danh sách sản phẩm</h2>
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
                  "lg:w-64 flex-shrink-0",
                  !showFilters && "hidden md:block"
                )}>
                  <ProductFilters
                    categories={categories}
                    filters={{
                      category: '',
                      priceMin: 0,
                      priceMax: 0,
                      search: '',
                      categoryId: categoryId,
                    }}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {/* Sort Controls */}
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      {productsData?.data?.total ? (
                        <>Hiển thị {sortedProducts.length} trong {productsData.data.total} sản phẩm</>
                      ) : (
                        'Đang tải...'
                      )}
                    </div>
                    <ProductSort
                      sortOptions={sortOptions}
                      sortBy={sortBy}
                      onSortChange={handleSortChange}
                    />
                  </div>

                  {/* Products Grid */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                      ))}
                    </div>
                  ) : error ? (
                    <ErrorState onRetry={handleRetry} />
                  ) : !productsData?.data?.items?.length ? (
                    <EmptyState type="no-results" onClearFilters={handleClearFilters} />
                  ) : (
                    <div
                      ref={gridRef}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      tabIndex={-1}
                      role="region"
                      aria-label="Danh sách sản phẩm"
                    >
                      {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {productsData?.data?.totalPages && productsData.data.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={page}
                        totalPages={productsData.data.totalPages}
                        totalItems={productsData.data.total}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
};

export default Products;