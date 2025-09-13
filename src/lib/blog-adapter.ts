import { BlogPost, mockBlogPosts } from './mock-blog';

// API Response types
export interface BlogPostResponse {
  data: BlogPost;
}

// Mock API implementation
const mockBlogAPI = async (slug: string): Promise<BlogPost | null> => {
  // Simulate network delay ~700ms for skeleton parity
  await new Promise((r) => setTimeout(r, 700));
  return mockBlogPosts.find(p => p.slug === slug) || null;
};

// Real API implementation (placeholder)
const realBlogAPI = async (slug: string): Promise<BlogPost | null> => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
  
  const response = await fetch(`${baseUrl}/blog/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Not found
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  
  // Map API response to BlogPost type
  const mapped: BlogPost = {
    id: json.id ?? slug,
    slug: json.slug ?? slug,
    title: json.title ?? 'Bài viết không có tiêu đề',
    excerpt: json.excerpt ?? json.summary ?? 'Đang cập nhật',
    category: json.category ?? json.categoryName ?? 'Chưa phân loại',
    coverUrl: json.coverUrl ?? json.thumbnail ?? json.image ?? '/images/placeholder-cover.svg',
    createdAt: json.createdAt ?? new Date().toISOString(),
    author: json.author ?? json.authorName ?? 'Tác giả',
    readTime: Number(json.readTime ?? json.readingTime ?? 5),
    updatedAt: json.updatedAt ?? json.modifiedAt ?? new Date().toISOString(),
    content: json.content ?? json.body ?? [
      {
        type: 'paragraph',
        content: 'Nội dung đang được cập nhật...'
      }
    ]
  };

  return mapped;
};

// Main adapter function
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const apiMode = import.meta.env.VITE_PRODUCTS_API_MODE || 'mock';
  
  try {
    if (apiMode === 'real') {
      return await realBlogAPI(slug);
    } else {
      return await mockBlogAPI(slug);
    }
  } catch (error) {
    // If real API fails, fallback to mock for graceful degradation
    if (apiMode === 'real') {
      // Silent fallback to avoid console spam
      return await mockBlogAPI(slug);
    }
    throw error;
  }
};
