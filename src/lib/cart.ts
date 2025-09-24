export interface CartItemSnapshot {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = 'cart_items_v1';

const read = (): CartItemSnapshot[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) =>
      x && typeof x.id === 'number' && typeof x.price === 'number' && typeof x.quantity === 'number'
    );
  } catch {
    return [];
  }
};

const write = (items: CartItemSnapshot[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
};

export const getCartItems = (): CartItemSnapshot[] => read();

export const addToCart = (item: CartItemSnapshot) => {
  const items = read();
  const existing = items.find((it) => it.id === item.id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + item.quantity, 99);
  } else {
    items.push({ ...item, quantity: Math.max(1, Math.min(item.quantity, 99)) });
  }
  write(items);
};

export const updateQuantity = (id: number, quantity: number) => {
  const items = read();
  const idx = items.findIndex((it) => it.id === id);
  if (idx >= 0) {
    const nextQty = Math.max(1, Math.min(quantity, 99));
    items[idx].quantity = nextQty;
    write(items);
  }
};

export const removeFromCart = (id: number) => {
  const items = read().filter((it) => it.id !== id);
  write(items);
};

export const clearCart = () => write([]);

export const computeSubtotal = (items: CartItemSnapshot[]): number => {
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  return Math.round(total);
};




