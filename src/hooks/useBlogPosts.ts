import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost, mockBlogPosts } from '@/lib/mock-blog';

export interface UseBlogPostsState {
  posts: BlogPost[];
  isLoading: boolean;
  isError: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const LOADING_MS = 700;
const POSTS_PER_PAGE = 6;

export function useBlogPosts(): UseBlogPostsState {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    // Check for dev toggles
    const searchParams = new URLSearchParams(location.search);
    const shouldForceEmpty = searchParams.get('empty') === '1';
    
    
    // Return empty array if empty toggle is active
    if (shouldForceEmpty) {
      return [];
    }

    let filtered = mockBlogPosts;

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, location.search]);

  // Pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('Tất cả');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  return {
    posts: paginatedPosts,
    isLoading,
    isError,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    clearFilters,
    currentPage,
    totalPages,
    totalPosts,
    goToPage,
    nextPage,
    prevPage,
  };
}


