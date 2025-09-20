import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { mockProducts, type Product } from '../lib/mock-data';

interface UseProductDetailResult {
  product: Product | null;
  related: Product[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useProductDetail(productId: number): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldForceError = searchParams.get('error') === '1';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // If query flag ?error=1 is present, show error immediately
    if (shouldForceError) {
      const t = setTimeout(() => {
        if (!isMounted) return;
        setError('Đã xảy ra lỗi khi tải sản phẩm.');
        setIsLoading(false);
      }, 700);
      return () => {
        isMounted = false;
        clearTimeout(t);
      };
    }

    // Normal product loading
    const timer = setTimeout(() => {
      if (!isMounted) return;
      try {
        const found = mockProducts.find(p => p.id === productId) || null;
        setProduct(found);
      } catch {
        setError('Đã xảy ra lỗi khi tải sản phẩm.');
      } finally {
        setIsLoading(false);
      }
    }, 700);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [productId, reloadKey, shouldForceError, location.search]);

  const related = useMemo(() => {
    if (!product) return [] as Product[];
    return mockProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const retry = () => {
    setReloadKey(k => k + 1);
  };

  return { product, related, isLoading, error, retry };
}
