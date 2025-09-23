import React, { useEffect, useRef, useState } from 'react';

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; price: number; status: 'active' | 'inactive' }) => Promise<void> | void;
  product?: { id: number; name: string; price: number; status: 'active' | 'inactive' } | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState<number>(product?.price ?? 0);
  const [status, setStatus] = useState<'active' | 'inactive'>(product?.status || 'active');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(product?.name || '');
      setPrice(product?.price ?? 0);
      setStatus(product?.status || 'active');
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [isOpen, product]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown, true);
    }
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tên sản phẩm là bắt buộc';
    if (Number.isNaN(price) || price <= 0) next.price = 'Giá phải lớn hơn 0';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave({ name: name.trim(), price, status });
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, root: err instanceof Error ? err.message : 'Không thể lưu' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={dialogRef} className="relative bg-background text-foreground rounded shadow-lg w-full max-w-md p-4">
        <h2 id="product-modal-title" className="text-lg font-semibold mb-3">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        </h2>

        {errors.root && (
          <div role="alert" className="mb-2 text-red-500 text-sm">{errors.root}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1" htmlFor="product-name">Tên sản phẩm</label>
          <input
            ref={firstFieldRef}
            id="product-name"
            type="text"
            className="w-full border rounded px-2 py-1 mb-1"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'product-name-err' : undefined}
          />
          {errors.name && <div id="product-name-err" role="alert" className="text-red-500 text-xs mb-2">{errors.name}</div>}

          <label className="block text-sm mb-1" htmlFor="product-price">Giá</label>
          <input
            id="product-price"
            type="number"
            className="w-full border rounded px-2 py-1 mb-1"
            value={Number.isNaN(price) ? '' : price}
            onChange={e => setPrice(Number(e.target.value))}
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? 'product-price-err' : undefined}
          />
          {errors.price && <div id="product-price-err" role="alert" className="text-red-500 text-xs mb-2">{errors.price}</div>}

          <label className="block text-sm mb-1" htmlFor="product-status">Trạng thái</label>
          <select
            id="product-status"
            className="w-full border rounded px-2 py-1 mb-4"
            value={status}
            onChange={e => setStatus(e.target.value as 'active' | 'inactive')}
          >
            <option value="active">Đang bán</option>
            <option value="inactive">Tạm ẩn</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Hủy</button>
            <button type="submit" disabled={submitting} className="px-3 py-1 rounded bg-primary text-primary-foreground">
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;


