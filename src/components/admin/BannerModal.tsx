import React, { useEffect, useRef, useState } from 'react';

export interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; imageUrl: string; linkUrl?: string; active: boolean }) => Promise<void> | void;
  banner?: { id: number; title: string; imageUrl: string; linkUrl?: string; active: boolean } | null;
}

const BannerModal: React.FC<BannerModalProps> = ({ isOpen, onClose, onSave, banner }) => {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(banner?.title || '');
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl || '');
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl || '');
  const [active, setActive] = useState<boolean>(banner?.active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(banner?.title || '');
      setImageUrl(banner?.imageUrl || '');
      setLinkUrl(banner?.linkUrl || '');
      setActive(banner?.active ?? true);
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [isOpen, banner]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      const container = document.getElementById('banner-modal-title')?.closest('[role="dialog"]') as HTMLElement | null;
      if (e.key === 'Tab' && container) {
        const focusable = container.querySelectorAll<HTMLElement>(
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
    if (isOpen) document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Tiêu đề là bắt buộc';
    if (!imageUrl.trim()) next.imageUrl = 'Ảnh là bắt buộc';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave({ title: title.trim(), imageUrl: imageUrl.trim(), linkUrl: linkUrl.trim() || undefined, active });
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, root: err instanceof Error ? err.message : 'Không thể lưu' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="banner-modal-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background text-foreground rounded shadow-lg w-full max-w-md p-4">
        <h2 id="banner-modal-title" className="text-lg font-semibold mb-3">{banner ? 'Chỉnh sửa banner' : 'Thêm banner'}</h2>
        {errors.root && <div role="alert" className="mb-2 text-red-500 text-sm">{errors.root}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1" htmlFor="banner-title">Tiêu đề</label>
          <input ref={firstFieldRef} id="banner-title" type="text" className="w-full border rounded px-2 py-1 mb-1" value={title} onChange={e => setTitle(e.target.value)} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'banner-title-err' : undefined} />
          {errors.title && <div id="banner-title-err" role="alert" className="text-red-500 text-xs mb-2">{errors.title}</div>}

          <label className="block text-sm mb-1" htmlFor="banner-image">Ảnh</label>
          <input id="banner-image" type="text" className="w-full border rounded px-2 py-1 mb-1" value={imageUrl} onChange={e => setImageUrl(e.target.value)} aria-invalid={!!errors.imageUrl} aria-describedby={errors.imageUrl ? 'banner-image-err' : undefined} />
          {errors.imageUrl && <div id="banner-image-err" role="alert" className="text-red-500 text-xs mb-2">{errors.imageUrl}</div>}

          <label className="block text-sm mb-1" htmlFor="banner-link">Liên kết (tùy chọn)</label>
          <input id="banner-link" type="text" className="w-full border rounded px-2 py-1 mb-3" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />

          <label className="inline-flex items-center gap-2 mb-4">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            <span>Hiển thị</span>
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Hủy</button>
            <button type="submit" disabled={submitting} className="px-3 py-1 rounded bg-primary text-primary-foreground">{submitting ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerModal;


