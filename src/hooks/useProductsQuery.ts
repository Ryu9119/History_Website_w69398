import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductCategories, getProductById, type ProductsParams, type ProductsResponse } from '../lib/products-adapter';

export interface UseProductsQueryParams extends ProductsParams {
  enabled?: boolean;
}

export const useProductsQuery = (params: UseProductsQueryParams = {}) => {
  const { enabled = true, ...queryParams } = params;

  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', queryParams],
    queryFn: async () => {
      // Dev-only test toggles via URL params
      if (import.meta.env.DEV) {
        const sp = new URLSearchParams(window.location.search);
        const shouldSlow = sp.get('slow') === '1';
        const shouldError = sp.get('error') === '1';
        if (shouldSlow) {
          // Ensure at least ~500ms delay to avoid skeleton flicker
          const delay = 500 + Math.floor(Math.random() * 700);
          await new Promise((r) => setTimeout(r, delay));
        }
        if (shouldError) {
          throw new Error('forced-error-products');
        }
      }
      return getProducts(queryParams);
    },
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

export const useProductByIdQuery = (id: number | undefined) => {
  return useQuery<{ product: Awaited<ReturnType<typeof getProductById>> }, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (typeof id !== 'number' || Number.isNaN(id)) throw new Error('invalid-id');
      // Dev-only test toggles via URL params
      if (import.meta.env.DEV) {
        const sp = new URLSearchParams(window.location.search);
        const shouldSlow = sp.get('slow') === '1';
        const shouldError = sp.get('error') === '1';
        if (shouldSlow) {
          // Ensure at least ~500ms delay to avoid skeleton flicker
          const delay = 500 + Math.floor(Math.random() * 700);
          await new Promise((r) => setTimeout(r, delay));
        }
        if (shouldError) {
          throw new Error('forced-error-product');
        }
      }
      const product = await getProductById(id);
      return { product };
    },
    enabled: typeof id === 'number' && !Number.isNaN(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message === 'invalid-id') return false;
      return failureCount < 2;
    },
  });
};
