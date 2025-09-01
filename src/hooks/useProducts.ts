import { useState, useEffect, useMemo } from 'react';
import { mockProducts, type Product, productCategories, sortOptions } from '../lib/mock-data';
import { isFeatureEnabled } from '../lib/feature-flags';

export interface ProductFilters {
  category: string;
  priceMin: number;
  priceMax: number;
  search: string;
}

export interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  categories: string[];
  sortOptions: typeof sortOptions;
}

export const useProducts = (): UseProductsReturn => {
  const [products] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'Tất cả',
    priceMin: 0,
    priceMax: 1000000,
    search: ''
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.category !== 'Tất cả' && product.category !== filters.category) {
        return false;
      }

      // Price filter - only if bonus features enabled
      if (isFeatureEnabled('ENABLE_PRICE_RANGE')) {
        if (product.price < filters.priceMin || product.price > filters.priceMax) {
          return false;
        }
      }

      // Search filter - only if bonus features enabled
      if (isFeatureEnabled('ENABLE_SEARCH') && filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort products - only if sorting enabled
    if (isFeatureEnabled('ENABLE_SORTING')) {
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          if (isFeatureEnabled('ENABLE_RATING_SORT')) {
            filtered.sort((a, b) => b.rating - a.rating);
          }
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [products, filters, sortBy]);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const retry = () => {
    setError(null);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  };

  return {
    products,
    filteredProducts,
    filters,
    setFilters: updateFilters,
    sortBy,
    setSortBy,
    isLoading,
    error,
    retry,
    categories: productCategories,
    sortOptions
  };
};
