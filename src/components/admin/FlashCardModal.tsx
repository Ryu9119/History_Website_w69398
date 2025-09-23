import React, { useEffect, useRef, useState } from 'react';

export interface FlashCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { topic: string; description?: string; totalCards: number }) => Promise<void> | void;
  flashCard?: { id: number; topic: string; description?: string; totalCards: number } | null;
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({ isOpen, onClose, onSave, flashCard }) => {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [topic, setTopic] = useState(flashCard?.topic || '');
  const [description, setDescription] = useState(flashCard?.description || '');
  const [totalCards, setTotalCards] = useState<number>(flashCard?.totalCards ?? 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTopic(flashCard?.topic || '');
      setDescription(flashCard?.description || '');
      setTotalCards(flashCard?.totalCards ?? 0);
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [isOpen, flashCard]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      const container = document.getElementById('flashcard-modal-title')?.closest('[role="dialog"]') as HTMLElement | null;
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
    if (!topic.trim()) next.topic = 'Chủ đề là bắt buộc';
    if (Number.isNaN(totalCards) || totalCards <= 0) next.totalCards = 'Số lượng thẻ phải > 0';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave({ topic: topic.trim(), description: description.trim() || undefined, totalCards });
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, root: err instanceof Error ? err.message : 'Không thể lưu' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="flashcard-modal-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background text-foreground rounded shadow-lg w-full max-w-md p-4">
        <h2 id="flashcard-modal-title" className="text-lg font-semibold mb-3">{flashCard ? 'Chỉnh sửa bộ thẻ' : 'Thêm bộ thẻ'}</h2>
        {errors.root && <div role="alert" className="mb-2 text-red-500 text-sm">{errors.root}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1" htmlFor="flashcard-topic">Chủ đề</label>
          <input ref={firstFieldRef} id="flashcard-topic" type="text" className="w-full border rounded px-2 py-1 mb-1" value={topic} onChange={e => setTopic(e.target.value)} aria-invalid={!!errors.topic} aria-describedby={errors.topic ? 'flashcard-topic-err' : undefined} />
          {errors.topic && <div id="flashcard-topic-err" role="alert" className="text-red-500 text-xs mb-2">{errors.topic}</div>}

          <label className="block text-sm mb-1" htmlFor="flashcard-desc">Mô tả (tùy chọn)</label>
          <input id="flashcard-desc" type="text" className="w-full border rounded px-2 py-1 mb-1" value={description} onChange={e => setDescription(e.target.value)} />

          <label className="block text-sm mb-1" htmlFor="flashcard-total">Số thẻ</label>
          <input id="flashcard-total" type="number" className="w-full border rounded px-2 py-1 mb-4" value={Number.isNaN(totalCards) ? '' : totalCards} onChange={e => setTotalCards(Number(e.target.value))} aria-invalid={!!errors.totalCards} aria-describedby={errors.totalCards ? 'flashcard-total-err' : undefined} />
          {errors.totalCards && <div id="flashcard-total-err" role="alert" className="text-red-500 text-xs mb-2">{errors.totalCards}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Hủy</button>
            <button type="submit" disabled={submitting} className="px-3 py-1 rounded bg-primary text-primary-foreground">{submitting ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashCardModal;


