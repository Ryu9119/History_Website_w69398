import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductCategories, type ProductsParams, type ProductsResponse } from '../lib/products-adapter';

export interface UseProductsQueryParams extends ProductsParams {
  enabled?: boolean;
}

export const useProductsQuery = (params: UseProductsQueryParams = {}) => {
  const { enabled = true, ...queryParams } = params;

  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error.message.includes('4')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useProductCategoriesQuery = () => {
  return useQuery<string[], Error>({
    queryKey: ['product-categories'],
    queryFn: getProductCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
