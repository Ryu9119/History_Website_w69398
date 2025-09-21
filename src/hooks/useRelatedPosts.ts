import { useMemo } from 'react';
import { BlogPost, mockBlogPosts } from '@/lib/mock-blog';

export const useRelatedPosts = (currentPost: BlogPost | null | undefined) => {
  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    
    // Find posts in the same category, excluding current post
    const sameCategoryPosts = mockBlogPosts.filter(
      post => post.category === currentPost.category && post.slug !== currentPost.slug
    );
    
    // If we have enough posts in same category, return up to 3
    if (sameCategoryPosts.length >= 3) {
      return sameCategoryPosts.slice(0, 3);
    }
    
    // If not enough posts in same category, fill with other posts
    const otherPosts = mockBlogPosts.filter(
      post => post.slug !== currentPost.slug && !sameCategoryPosts.includes(post)
    );
    
    // Combine same category posts with other posts, limit to 3 total
    return [...sameCategoryPosts, ...otherPosts].slice(0, 3);
  }, [currentPost]);

  return relatedPosts;
};