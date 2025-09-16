import { mockProducts } from './mock-data';
import { mockBlogPosts } from './mock-blog';
import { mockFlashcardDecks } from './mock-flashcards';

export interface AdminStats {
  totalProducts: number;
  totalBlogs: number;
  totalFlashcards: number;
  totalCategories: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

// Mock admin stats
export const getAdminStats = async (): Promise<AdminStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return {
    totalProducts: mockProducts.length,
    totalBlogs: mockBlogPosts.length,
    totalFlashcards: mockFlashcardDecks.length,
    totalCategories: 12, // Mock category count
  };
};

// Mock admin products data (simplified for table)
export const getAdminProducts = async (): Promise<AdminProduct[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockProducts.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.rating,
    createdAt: product.createdAt,
    status: 'active' as const,
  }));
};

// Dev toggle support
export const getAdminStatsWithToggle = async (): Promise<AdminStats> => {
  if (import.meta.env.DEV) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === '1') {
      throw new Error('Mock admin stats error');
    }
    if (urlParams.get('slow') === '1') {
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
  }
  
  return getAdminStats();
};

export const getAdminProductsWithToggle = async (): Promise<AdminProduct[]> => {
  if (import.meta.env.DEV) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === '1') {
      throw new Error('Mock admin products error');
    }
    if (urlParams.get('slow') === '1') {
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
  }
  
  return getAdminProducts();
};
