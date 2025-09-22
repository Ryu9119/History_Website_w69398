import { mockProducts, type Product } from './mock-data';

// API Response types
export interface ProductsResponse {
  data: {
    items: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  categoryId?: number;
}

// Mock API implementation
const mockProductsAPI = async (params: ProductsParams): Promise<ProductsResponse> => {
  // Simulate network delay (min ~700ms to ensure skeleton visibility)
  await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 800));

  let filteredProducts = [...mockProducts];

  // Apply filters
  if (params.categoryId) {
    // Map categoryId to category name for mock data
    const categoryMap: Record<number, string> = {
      1: 'Sách',
      2: 'Flashcard', 
      3: 'Bản đồ',
      4: 'Truyện tranh',
      5: 'Video',
      6: 'Audio'
    };
    const categoryName = categoryMap[params.categoryId];
    if (categoryName) {
      filteredProducts = filteredProducts.filter(p => p.category === categoryName);
    }
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    data: {
      items: paginatedProducts,
      total,
      page,
      limit,
      totalPages
    }
  };
};

// Real API implementation (placeholder)
const realProductsAPI = async (params: ProductsParams): Promise<ProductsResponse> => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());

  const url = `${baseUrl}/products?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Main adapter function
export const getProducts = async (params: ProductsParams = {}): Promise<ProductsResponse> => {
  const apiMode = import.meta.env.VITE_PRODUCTS_API_MODE || 'mock';
  
  try {
    if (apiMode === 'real') {
      return await realProductsAPI(params);
    } else {
      return await mockProductsAPI(params);
    }
  } catch (_err) {
    // If real API fails, fallback to mock for graceful degradation
    if (apiMode === 'real') {
      // Silent fallback to avoid console spam
      return await mockProductsAPI(params);
    }
    throw _err;
  }
};

// Get available categories
export const getProductCategories = async (): Promise<string[]> => {
  const apiMode = import.meta.env.VITE_PRODUCTS_API_MODE || 'mock';
  
  if (apiMode === 'real') {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
      const response = await fetch(`${baseUrl}/products/categories`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch {
      // Silent fallback to avoid console spam
      return ['Tất cả', 'Sách', 'Flashcard', 'Bản đồ', 'Truyện tranh', 'Video', 'Audio'];
    }
  } else {
    // Mock categories
    return ['Tất cả', 'Sách', 'Flashcard', 'Bản đồ', 'Truyện tranh', 'Video', 'Audio'];
  }
};

// Helper: category id to label mapping used in mock
const CATEGORY_ID_TO_LABEL: Record<number, string> = {
  1: 'Sách',
  2: 'Flashcard',
  3: 'Bản đồ',
  4: 'Truyện tranh',
  5: 'Video',
  6: 'Audio',
};

export const getCategoryLabelById = (id?: number): string | undefined => {
  if (!id) return undefined;
  return CATEGORY_ID_TO_LABEL[id];
};

// Product detail
export const getProductById = async (id: number): Promise<Product | null> => {
  const apiMode = import.meta.env.VITE_PRODUCTS_API_MODE || 'mock';

  const mockFn = async (): Promise<Product | null> => {
    // Simulate network delay ~700ms for skeleton parity
    await new Promise((r) => setTimeout(r, 700));
    return mockProducts.find(p => p.id === id) || null;
  };

  if (apiMode === 'real') {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
      const res = await fetch(`${baseUrl}/products/${id}`, { headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const json = await res.json();
      // Map placeholder JSON to Product shape if needed
      const mapped: Product = {
        id: json.id ?? id,
        name: json.name ?? json.title ?? `Sản phẩm #${id}`,
        description: json.description ?? '',
        price: Number(json.price ?? 0),
        category: json.category ?? json.categoryName ?? 'Sách',
        image: json.image ?? json.thumbnail ?? '/placeholder-cover.svg',
        createdAt: json.createdAt ?? new Date().toISOString(),
        rating: Number(json.rating ?? 0),
      } as Product;
      // Ensure minimum 700ms for skeleton consistency
      await new Promise((r) => setTimeout(r, 700));
      return mapped;
    } catch {
      // Silent fallback to mock for graceful degradation
      return mockFn();
    }
  }

  return mockFn();
};
