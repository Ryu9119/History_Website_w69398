import React, { useEffect, useRef, useState } from 'react';

export interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; slug: string; excerpt: string; content: string; status: 'draft' | 'published' }) => Promise<void> | void;
  blog?: { id: number; title: string; slug: string; excerpt: string; content: string; status: 'draft' | 'published' } | null;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, onSave, blog }) => {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(blog?.title || '');
  const [slug, setSlug] = useState(blog?.slug || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [content, setContent] = useState(blog?.content || '');
  const [status, setStatus] = useState<'draft' | 'published'>(blog?.status || 'draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(blog?.title || '');
      setSlug(blog?.slug || '');
      setExcerpt(blog?.excerpt || '');
      setContent(blog?.content || '');
      setStatus(blog?.status || 'draft');
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [isOpen, blog]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      const container = document.getElementById('blog-modal-title')?.closest('[role="dialog"]') as HTMLElement | null;
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
    if (!slug.trim()) next.slug = 'Slug là bắt buộc';
    if (!/^[a-z0-9-]+$/.test(slug)) next.slug = 'Slug chỉ gồm chữ thường, số và dấu -';
    if (!excerpt.trim()) next.excerpt = 'Tóm tắt là bắt buộc';
    if (!content.trim()) next.content = 'Nội dung là bắt buộc';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave({ title: title.trim(), slug: slug.trim(), excerpt: excerpt.trim(), content: content.trim(), status });
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, root: err instanceof Error ? err.message : 'Không thể lưu' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="blog-modal-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background text-foreground rounded shadow-lg w-full max-w-xl p-4">
        <h2 id="blog-modal-title" className="text-lg font-semibold mb-3">
          {blog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
        </h2>

        {errors.root && <div role="alert" className="mb-2 text-red-500 text-sm">{errors.root}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1" htmlFor="blog-title">Tiêu đề</label>
          <input ref={firstFieldRef} id="blog-title" type="text" className="w-full border rounded px-2 py-1 mb-1" value={title} onChange={e => setTitle(e.target.value)} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'blog-title-err' : undefined} />
          {errors.title && <div id="blog-title-err" role="alert" className="text-red-500 text-xs mb-2">{errors.title}</div>}

          <label className="block text-sm mb-1" htmlFor="blog-slug">Slug</label>
          <input id="blog-slug" type="text" className="w-full border rounded px-2 py-1 mb-1" value={slug} onChange={e => setSlug(e.target.value)} aria-invalid={!!errors.slug} aria-describedby={errors.slug ? 'blog-slug-err' : undefined} />
          {errors.slug && <div id="blog-slug-err" role="alert" className="text-red-500 text-xs mb-2">{errors.slug}</div>}

          <label className="block text-sm mb-1" htmlFor="blog-excerpt">Tóm tắt</label>
          <input id="blog-excerpt" type="text" className="w-full border rounded px-2 py-1 mb-1" value={excerpt} onChange={e => setExcerpt(e.target.value)} aria-invalid={!!errors.excerpt} aria-describedby={errors.excerpt ? 'blog-excerpt-err' : undefined} />
          {errors.excerpt && <div id="blog-excerpt-err" role="alert" className="text-red-500 text-xs mb-2">{errors.excerpt}</div>}

          <label className="block text-sm mb-1" htmlFor="blog-content">Nội dung</label>
          <textarea id="blog-content" className="w-full border rounded px-2 py-1 mb-1 h-32" value={content} onChange={e => setContent(e.target.value)} aria-invalid={!!errors.content} aria-describedby={errors.content ? 'blog-content-err' : undefined} />
          {errors.content && <div id="blog-content-err" role="alert" className="text-red-500 text-xs mb-2">{errors.content}</div>}

          <label className="block text-sm mb-1" htmlFor="blog-status">Trạng thái</label>
          <select id="blog-status" className="w-full border rounded px-2 py-1 mb-4" value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')}>
            <option value="draft">Nháp</option>
            <option value="published">Xuất bản</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Hủy</button>
            <button type="submit" disabled={submitting} className="px-3 py-1 rounded bg-primary text-primary-foreground">{submitting ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;


