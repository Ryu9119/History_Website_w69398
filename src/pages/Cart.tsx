import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, updateQuantity, removeFromCart, computeSubtotal } from '../lib/cart';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState(getCartItems());

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        // DEV toggles
        if (import.meta.env.DEV) {
          const sp = new URLSearchParams(window.location.search);
          const shouldError = sp.get('error') === '1';
          await new Promise((r) => setTimeout(r, 700));
          if (shouldError) throw new Error('forced-error-cart');
        } else {
          await new Promise((r) => setTimeout(r, 200));
        }
        if (!cancelled) setItems(getCartItems());
    } catch {
        if (!cancelled) setError('Không thể tải giỏ hàng.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const subtotal = useMemo(() => computeSubtotal(items), [items]);

  const onInc = (id: number) => {
    const current = items.find(i => i.id === id)?.quantity ?? 1;
    updateQuantity(id, Math.min(current + 1, 99));
    setItems(getCartItems());
  };
  const onDec = (id: number) => {
    const current = items.find(i => i.id === id)?.quantity ?? 1;
    updateQuantity(id, Math.max(current - 1, 1));
    setItems(getCartItems());
  };
  const onRemove = (id: number) => {
    removeFromCart(id);
    setItems(getCartItems());
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-1/3 bg-muted rounded animate-pulse" />
        <div className="mt-6 space-y-3">
          <div className="h-20 w-full bg-card border border-border rounded animate-pulse" />
          <div className="h-20 w-full bg-card border border-border rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <h1 className="text-xl font-semibold text-card-foreground">Đã xảy ra lỗi</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <button
            onClick={() => {
              const sp = new URLSearchParams(window.location.search);
              sp.delete('error');
              const url = `${window.location.pathname}?${sp.toString()}`.replace(/\?$/,'');
              window.history.replaceState({}, '', url);
              setError(null);
              setLoading(true);
              setTimeout(() => {
                setItems(getCartItems());
                setLoading(false);
              }, 700);
            }}
            className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate('/products')}
            className="mt-3 ml-2 px-4 py-2 rounded-md border border-border"
          >
            Tiếp tục mua hàng
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <h1 className="text-xl font-semibold text-card-foreground">Giỏ hàng trống</h1>
          <p className="text-muted-foreground mt-2">Hãy thêm sản phẩm để tiếp tục.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-card-foreground">Giỏ hàng</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <div key={it.id} className="bg-card border border-border rounded-md p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">{it.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(it.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Giảm số lượng"
                  onClick={() => onDec(it.id)}
                  className="px-2 py-1 rounded border border-border"
                >
                  −
                </button>
                <span className="w-10 text-center" aria-live="polite">{it.quantity}</span>
                <button
                  aria-label="Tăng số lượng"
                  onClick={() => onInc(it.id)}
                  className="px-2 py-1 rounded border border-border"
                >
                  +
                </button>
                <button
                  aria-label="Xoá sản phẩm"
                  onClick={() => onRemove(it.id)}
                  className="ml-3 px-3 py-1 rounded bg-secondary text-secondary-foreground"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
        <aside className="bg-card border border-border rounded-md p-4 h-fit">
          <h2 className="font-semibold text-card-foreground">Tổng kết</h2>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-4 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Thanh toán
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;


