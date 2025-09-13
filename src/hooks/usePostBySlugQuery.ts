import { useQuery } from '@tanstack/react-query';
import { getPostBySlug } from '../lib/blog-adapter';

export const usePostBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
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
          throw new Error('forced-error-blog-post');
        }
      }
      
      return getPostBySlug(slug);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error.message.includes('4')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
