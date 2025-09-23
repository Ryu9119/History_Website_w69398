// Mock Admin API with CRUD operations and role checks
// - Storage: in-memory + localStorage persistence per entity
// - Delay: ~700ms; DEV toggles via ?error=1 and ?slow=1
// - Roles: simple check from current user email; only "admin" can mutate

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
}

export interface AdminStats {
  totalProducts: number;
  totalBlogs: number;
  totalFlashcards: number;
  totalCategories: number;
}

export interface CategoryRef {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number | null;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  categoryId: number | null;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlashCardDeck {
  id: number;
  topic: string;
  description?: string;
  totalCards: number;
  createdAt: string;
  updatedAt: string;
}

type Entity = 'products' | 'blogs' | 'banners' | 'flashcards';

const STORAGE_KEY: Record<Entity, string> = {
  products: 'admin_products',
  blogs: 'admin_blogs',
  banners: 'admin_banners',
  flashcards: 'admin_flashcards',
};

const DEFAULT_DELAY_MS = 700;

function devToggles(): { shouldError: boolean; delayMs: number } {
  if (typeof window === 'undefined') return { shouldError: false, delayMs: DEFAULT_DELAY_MS };
  const sp = new URLSearchParams(window.location.search);
  const shouldError = sp.get('error') === '1';
  const isSlow = sp.get('slow') === '1';
  return { shouldError, delayMs: isSlow ? Math.max(1200, DEFAULT_DELAY_MS) : DEFAULT_DELAY_MS };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id: number; email: string; name: string };
    // Simple role mapping: test@example.com is admin; others viewer
    const role: AdminRole = parsed.email === 'test@example.com' ? 'admin' : 'viewer';
    return { id: parsed.id, email: parsed.email, name: parsed.name, role };
  } catch {
    return null;
  }
}

function ensurePermission(): void {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (user.role !== 'admin') {
    throw new Error('Forbidden: insufficient permissions');
  }
}

// Seed helpers
function nowIso(): string {
  return new Date().toISOString();
}

function nextId(items: Array<{ id: number }>): number {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

// Initialize defaults if absent
function initDefaults(): void {
  const products = loadFromStorage<Product[]>(STORAGE_KEY.products, []);
  const blogs = loadFromStorage<BlogPost[]>(STORAGE_KEY.blogs, []);
  const banners = loadFromStorage<Banner[]>(STORAGE_KEY.banners, []);
  const flashcards = loadFromStorage<FlashCardDeck[]>(STORAGE_KEY.flashcards, []);

  if (products.length === 0) {
    const initial: Product[] = [
      { id: 1, name: 'Sản phẩm demo', categoryId: null, price: 100000, status: 'active', createdAt: nowIso(), updatedAt: nowIso() },
    ];
    saveToStorage(STORAGE_KEY.products, initial);
  }
  if (blogs.length === 0) {
    const initial: BlogPost[] = [
      { id: 1, title: 'Bài viết demo', slug: 'bai-viet-demo', categoryId: null, excerpt: 'Tóm tắt...', content: 'Nội dung...', status: 'published', createdAt: nowIso(), updatedAt: nowIso() },
    ];
    saveToStorage(STORAGE_KEY.blogs, initial);
  }
  if (banners.length === 0) {
    const initial: Banner[] = [
      { id: 1, title: 'Banner demo', imageUrl: '/banner-demo.png', linkUrl: '/', active: true, createdAt: nowIso(), updatedAt: nowIso() },
    ];
    saveToStorage(STORAGE_KEY.banners, initial);
  }
  if (flashcards.length === 0) {
    const initial: FlashCardDeck[] = [
      { id: 1, topic: 'Lịch sử Việt Nam', description: 'Bộ thẻ mẫu', totalCards: 20, createdAt: nowIso(), updatedAt: nowIso() },
    ];
    saveToStorage(STORAGE_KEY.flashcards, initial);
  }
}

initDefaults();

async function withLatencyAndDev<T>(fn: () => T | Promise<T>): Promise<T> {
  const { shouldError, delayMs } = devToggles();
  await sleep(delayMs);
  if (shouldError) {
    throw new Error('DEV: forced admin-api error');
  }
  return await fn();
}

export const adminApi = {
  // Stats
  async stats(): Promise<AdminStats> {
    return withLatencyAndDev(() => {
      const products = loadFromStorage<Product[]>(STORAGE_KEY.products, []);
      const blogs = loadFromStorage<BlogPost[]>(STORAGE_KEY.blogs, []);
      const flashcards = loadFromStorage<FlashCardDeck[]>(STORAGE_KEY.flashcards, []);
      const totalCategories = 12;
      return {
        totalProducts: products.length,
        totalBlogs: blogs.length,
        totalFlashcards: flashcards.length,
        totalCategories,
      };
    });
  },

  // Role
  async me(): Promise<AdminUser | null> {
    return withLatencyAndDev(() => getCurrentUser());
  },

  // Products
  async listProducts(): Promise<Product[]> {
    return withLatencyAndDev(() => loadFromStorage<Product[]>(STORAGE_KEY.products, []));
  },
  async createProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<Product[]>(STORAGE_KEY.products, []);
      const created: Product = { ...input, id: nextId(items), createdAt: nowIso(), updatedAt: nowIso() };
      const next = [...items, created];
      saveToStorage(STORAGE_KEY.products, next);
      return created;
    });
  },
  async updateProduct(id: number, input: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<Product[]>(STORAGE_KEY.products, []);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Product not found');
      const updated: Product = { ...items[idx], ...input, updatedAt: nowIso() };
      const next = [...items];
      next[idx] = updated;
      saveToStorage(STORAGE_KEY.products, next);
      return updated;
    });
  },
  async deleteProduct(id: number): Promise<{ success: boolean }> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<Product[]>(STORAGE_KEY.products, []);
      const next = items.filter(i => i.id !== id);
      saveToStorage(STORAGE_KEY.products, next);
      return { success: true };
    });
  },

  // Blogs
  async listBlogs(): Promise<BlogPost[]> {
    return withLatencyAndDev(() => loadFromStorage<BlogPost[]>(STORAGE_KEY.blogs, []));
  },
  async createBlog(input: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<BlogPost[]>(STORAGE_KEY.blogs, []);
      const created: BlogPost = { ...input, id: nextId(items), createdAt: nowIso(), updatedAt: nowIso() };
      const next = [...items, created];
      saveToStorage(STORAGE_KEY.blogs, next);
      return created;
    });
  },
  async updateBlog(id: number, input: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<BlogPost> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<BlogPost[]>(STORAGE_KEY.blogs, []);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Blog not found');
      const updated: BlogPost = { ...items[idx], ...input, updatedAt: nowIso() };
      const next = [...items];
      next[idx] = updated;
      saveToStorage(STORAGE_KEY.blogs, next);
      return updated;
    });
  },
  async deleteBlog(id: number): Promise<{ success: boolean }> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<BlogPost[]>(STORAGE_KEY.blogs, []);
      const next = items.filter(i => i.id !== id);
      saveToStorage(STORAGE_KEY.blogs, next);
      return { success: true };
    });
  },

  // Banners
  async listBanners(): Promise<Banner[]> {
    return withLatencyAndDev(() => loadFromStorage<Banner[]>(STORAGE_KEY.banners, []));
  },
  async createBanner(input: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<Banner[]>(STORAGE_KEY.banners, []);
      const created: Banner = { ...input, id: nextId(items), createdAt: nowIso(), updatedAt: nowIso() };
      const next = [...items, created];
      saveToStorage(STORAGE_KEY.banners, next);
      return created;
    });
  },
  async updateBanner(id: number, input: Partial<Omit<Banner, 'id' | 'createdAt'>>): Promise<Banner> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<Banner[]>(STORAGE_KEY.banners, []);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Banner not found');
      const updated: Banner = { ...items[idx], ...input, updatedAt: nowIso() };
      const next = [...items];
      next[idx] = updated;
      saveToStorage(STORAGE_KEY.banners, next);
      return updated;
    });
  },
  async deleteBanner(id: number): Promise<{ success: boolean }> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<Banner[]>(STORAGE_KEY.banners, []);
      const next = items.filter(i => i.id !== id);
      saveToStorage(STORAGE_KEY.banners, next);
      return { success: true };
    });
  },

  // Flashcards
  async listFlashcards(): Promise<FlashCardDeck[]> {
    return withLatencyAndDev(() => loadFromStorage<FlashCardDeck[]>(STORAGE_KEY.flashcards, []));
  },
  async createFlashcard(input: Omit<FlashCardDeck, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlashCardDeck> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<FlashCardDeck[]>(STORAGE_KEY.flashcards, []);
      const created: FlashCardDeck = { ...input, id: nextId(items), createdAt: nowIso(), updatedAt: nowIso() };
      const next = [...items, created];
      saveToStorage(STORAGE_KEY.flashcards, next);
      return created;
    });
  },
  async updateFlashcard(id: number, input: Partial<Omit<FlashCardDeck, 'id' | 'createdAt'>>): Promise<FlashCardDeck> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<FlashCardDeck[]>(STORAGE_KEY.flashcards, []);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Flashcard not found');
      const updated: FlashCardDeck = { ...items[idx], ...input, updatedAt: nowIso() };
      const next = [...items];
      next[idx] = updated;
      saveToStorage(STORAGE_KEY.flashcards, next);
      return updated;
    });
  },
  async deleteFlashcard(id: number): Promise<{ success: boolean }> {
    return withLatencyAndDev(() => {
      ensurePermission();
      const items = loadFromStorage<FlashCardDeck[]>(STORAGE_KEY.flashcards, []);
      const next = items.filter(i => i.id !== id);
      saveToStorage(STORAGE_KEY.flashcards, next);
      return { success: true };
    });
  },
};


