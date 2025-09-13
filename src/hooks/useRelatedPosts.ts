import { useMemo } from 'react';
import { BlogPost, mockBlogPosts } from '@/lib/mock-blog';

export const useRelatedPosts = (currentPost: BlogPost | null) => {
  return useMemo(() => {
    if (!currentPost) return [];
    
    return mockBlogPosts
      .filter(p => p.category === currentPost.category && p.slug !== currentPost.slug)
      .slice(0, 3);
  }, [currentPost]);
};
