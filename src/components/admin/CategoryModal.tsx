import React, { useEffect, useRef, useState } from 'react';

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => Promise<void> | void;
  category?: { id: number; name: string } | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(category?.name || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(category?.name || '');
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [isOpen, category]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      const container = document.getElementById('category-modal-title')?.closest('[role="dialog"]') as HTMLElement | null;
      if (e.key === 'Tab' && container) {
        const focusable = container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      }
    }
    if (isOpen) document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tên danh mục là bắt buộc';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave({ name: name.trim() });
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, root: err instanceof Error ? err.message : 'Không thể lưu' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="category-modal-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background text-foreground rounded shadow-lg w-full max-w-md p-4">
        <h2 id="category-modal-title" className="text-lg font-semibold mb-3">{category ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
        {errors.root && <div role="alert" className="mb-2 text-red-500 text-sm">{errors.root}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1" htmlFor="category-name">Tên danh mục</label>
          <input ref={firstFieldRef} id="category-name" type="text" className="w-full border rounded px-2 py-1 mb-1" value={name} onChange={e => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'category-name-err' : undefined} />
          {errors.name && <div id="category-name-err" role="alert" className="text-red-500 text-xs mb-2">{errors.name}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Hủy</button>
            <button type="submit" disabled={submitting} className="px-3 py-1 rounded bg-primary text-primary-foreground">{submitting ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;




