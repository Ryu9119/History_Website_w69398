import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost, mockBlogPosts } from '@/lib/mock-blog';

export const useBlogDetail = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const location = useLocation();

  // Check if we should force an error for testing
  const shouldForceError = location.search.includes('error=1');

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setIsLoading(true);
      setIsError(false);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));

      if (shouldForceError) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      // Find blog post by slug
      const foundPost = mockBlogPosts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
      } else {
        setPost(null);
      }
      
      setIsLoading(false);
    };

    if (slug) {
      fetchBlogDetail();
    }
  }, [slug, location.search, shouldForceError]);

  // Get related posts (same category, max 3, exclude current)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    
    return mockBlogPosts
      .filter(p => p.category === post.category && p.slug !== post.slug)
      .slice(0, 3);
  }, [post]);

  const retry = () => {
    setIsError(false);
    setIsLoading(true);
    // Re-fetch the data
    setTimeout(() => {
      const foundPost = mockBlogPosts.find(p => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
      }
      setIsLoading(false);
    }, 700);
  };

  return {
    post,
    isLoading,
    isError,
    relatedPosts,
    retry
  };
};

