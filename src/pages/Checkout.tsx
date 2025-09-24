import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearCart, getCartItems } from '../lib/cart';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; address?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Vui lòng nhập họ tên';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Email không hợp lệ';
    if (!address.trim()) next.address = 'Vui lòng nhập địa chỉ';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate submit delay
    await new Promise((r) => setTimeout(r, 600));
    if (getCartItems().length === 0) {
      setSubmitting(false);
      return navigate('/cart');
    }
    clearCart();
    navigate('/payment-success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-card-foreground">Thanh toán</h1>
      <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-card-foreground">Họ tên</label>
          <input
            id="name"
            type="text"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-card-foreground">Email</label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-card-foreground">Địa chỉ</label>
          <textarea
            id="address"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
            rows={4}
          />
          {errors.address && (
            <p id="address-error" className="mt-1 text-sm text-red-600" role="alert">{errors.address}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
        >
          {submitting ? 'Đang xử lý…' : 'Xác nhận thanh toán'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;



