import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFlashcardDetail } from '@/hooks/useFlashcardDetail';
import { type FlashcardDeck } from '@/lib/mock-flashcards';

function difficultyToVi(difficulty: FlashcardDeck['difficulty']): string {
  switch (difficulty) {
    case 'Beginner':
      return 'Cơ bản';
    case 'Intermediate':
      return 'Trung cấp';
    case 'Advanced':
      return 'Nâng cao';
    default:
      return String(difficulty);
  }
}

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-40 bg-muted rounded" />
    <div className="h-10 w-72 bg-muted rounded" />
    <div className="h-48 bg-muted rounded" />
  </div>
);

export default function FlashcardDetail() {
  const { id } = useParams<{ id: string }>();
  const { deck, cards, isLoading, isError, retry } = useFlashcardDetail(id || '');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const cardButtonRef = useRef<HTMLButtonElement>(null);
  const flippingRef = useRef(false);

  useEffect(() => {
    // Reset to front when card changes
    setIsFront(true);
  }, [currentIndex]);

  const total = cards.length;
  const current = cards[currentIndex];

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < total - 1;

  const handleFlip = () => {
    if (flippingRef.current) return; // debounce simple
    flippingRef.current = true;
    setIsFront(v => !v);
    setTimeout(() => {
      flippingRef.current = false;
    }, 180);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Skeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
        <h1 className="text-xl font-semibold">Đã xảy ra lỗi khi tải bộ thẻ</h1>
        <div className="flex justify-center gap-3">
          <button
            onClick={retry}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Thử lại
          </button>
          <Link
            to="/flashcards"
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (!deck || total === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
        <h1 className="text-xl font-semibold">Không tìm thấy bộ thẻ</h1>
        <Link
          to="/flashcards"
          className="inline-flex px-4 py-2 rounded-md border border-border bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Về trang Flashcards
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <Link to="/flashcards" className="text-sm text-muted-foreground hover:underline">&larr; Danh sách bộ thẻ</Link>
        <h1 className="text-2xl font-semibold">{deck.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card">{deck.category}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card">{difficultyToVi(deck.difficulty)}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card">{total} thẻ</span>
        </div>
      </header>

      <section className="space-y-4">
        <div className="mx-auto max-w-xl">
          <button
            ref={cardButtonRef}
            type="button"
            role="button"
            aria-pressed={!isFront}
            onClick={handleFlip}
            onKeyDown={handleKey}
            className="w-full aspect-[4/3] rounded-lg border border-border bg-card text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring grid place-items-center select-none"
          >
            <span className="px-6 text-center text-lg">
              {isFront ? current.front : current.back}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (!canPrev) return;
              setCurrentIndex(i => Math.max(0, i - 1));
              // return focus to card for seamless keyboard flow
              setTimeout(() => cardButtonRef.current?.focus(), 0);
            }}
            disabled={!canPrev}
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Trước
          </button>
          <div className="text-sm text-muted-foreground" aria-live="polite">Thẻ {currentIndex + 1} / {total}</div>
          <button
            type="button"
            onClick={() => {
              if (!canNext) return;
              setCurrentIndex(i => Math.min(total - 1, i + 1));
              // return focus to card for seamless keyboard flow
              setTimeout(() => cardButtonRef.current?.focus(), 0);
            }}
            disabled={!canNext}
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Sau
          </button>
        </div>
      </section>
    </div>
  );
}


