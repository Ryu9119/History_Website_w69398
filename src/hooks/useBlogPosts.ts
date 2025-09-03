import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost, mockBlogPosts } from '@/lib/mock-blog';

export interface UseBlogPostsState {
  posts: BlogPost[];
  isLoading: boolean;
  isError: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  clearFilters: () => void;
}

const LOADING_MS = 700;

export function useBlogPosts(): UseBlogPostsState {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    const searchParams = new URLSearchParams(location.search);
    const shouldForceError = searchParams.get('error') === '1';

    const timer = setTimeout(() => {
      if (!isMounted) return;
      if (shouldForceError) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }, LOADING_MS);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location.search]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'Tất cả') return mockBlogPosts;
    return mockBlogPosts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const clearFilters = () => setSelectedCategory('Tất cả');

  return {
    posts: filtered,
    isLoading,
    isError,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
  };
}


