// User types
export interface User {
  id: number;
  email: string;
  username: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  photo: string | null;
  role: Role;
  status: Status;
  __entity: string;
}

export interface Role {
  id: number;
  name: string;
  __entity: string;
}

export interface Status {
  id: number;
  name: string;
  __entity: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  image: string;
  categoryId: number;
  category: Category;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Blog types
export interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  image: string;
  categoryId: number;
  category: Category;
  authorId: number;
  author: User;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Flashcard types
export interface FlashCard {
  id: number;
  question: string;
  answer: string;
  categoryId: number;
  category: Category;
  difficulty: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
