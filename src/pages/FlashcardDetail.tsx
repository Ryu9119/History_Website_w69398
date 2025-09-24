import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const cardButtonRef = useRef<HTMLButtonElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const flippingRef = useRef(false);
  const keyHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const keyActivatedRef = useRef(false);

  useEffect(() => {
    // Reset to front when card changes
    setIsFront(true);
    setIsFlipping(false);
    // Mark current card as viewed
    setViewedCards(prev => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  // Mark current card as viewed when component mounts or cards change
  useEffect(() => {
    if (cards.length > 0) {
      setViewedCards(prev => new Set([...prev, currentIndex]));
    }
  }, [cards.length, currentIndex]);

  // On id change: reset local state and scroll to top
  useEffect(() => {
    setCurrentIndex(0);
    setIsFront(true);
    setIsFlipping(false);
    setViewedCards(new Set());
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Check completion state
  useEffect(() => {
    const total = cards.length;
    if (viewedCards.size === total && total > 0) {
      setIsCompleted(true);
    }
  }, [viewedCards.size, cards.length]);

  // Update live region for progress
  useEffect(() => {
    const total = cards.length;
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Đang hiển thị thẻ ${currentIndex + 1} trong ${total}. Đã xem ${viewedCards.size} thẻ.`;
    }
  }, [currentIndex, cards.length, viewedCards.size]);

  // Focus card button on successful load
  useEffect(() => {
    if (!isLoading && !isError && cards.length > 0) {
      requestAnimationFrame(() => {
        cardButtonRef.current?.focus();
      });
    }
  }, [isLoading, isError, cards.length]);

  // Global Arrow navigation (optional but recommended)
  useEffect(() => {
    keyHandlerRef.current = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(i => Math.min(cards.length - 1, i + 1));
        setTimeout(() => cardButtonRef.current?.focus(), 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(i => Math.max(0, i - 1));
        setTimeout(() => cardButtonRef.current?.focus(), 0);
      }
    };
    const handler = (e: KeyboardEvent) => keyHandlerRef.current?.(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cards.length]);

  const total = cards.length;
  const current = cards[currentIndex];

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < total - 1;

  const handleFlip = () => {
    if (flippingRef.current || isFlipping) return; // debounce simple
    flippingRef.current = true;
    setIsFlipping(true);
    
    // Start flip animation
    setTimeout(() => {
      setIsFront(v => !v);
    }, 150);
    
    // End flip animation
    setTimeout(() => {
      setIsFlipping(false);
      flippingRef.current = false;
    }, 300);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      keyActivatedRef.current = true;
      handleFlip();
      // reset guard in next tick
      setTimeout(() => {
        keyActivatedRef.current = false;
      }, 0);
    }
  };

  const handleRetry = () => {
    if (import.meta.env.DEV && searchParams.get('error') === '1') {
      // Remove error parameter and reload current flashcard
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      const newUrl = `/flashcards/${id}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
      navigate(newUrl);
      return;
    }
    retry();
    requestAnimationFrame(() => cardButtonRef.current?.focus());
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 ref={mainHeadingRef} id="main-content" tabIndex={-1} className="sr-only">Luyện tập Flashcards</h1>
        <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only">Đang tải bộ thẻ…</div>
        <Skeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
        <h1 ref={mainHeadingRef} id="main-content" tabIndex={-1} className="text-xl font-semibold">Đã xảy ra lỗi khi tải bộ thẻ</h1>
        <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only">Có lỗi xảy ra</div>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleRetry}
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

  if (!deck) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
        <h1 ref={mainHeadingRef} id="main-content" tabIndex={-1} className="text-xl font-semibold">Không tìm thấy bộ thẻ</h1>
        <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only">Không tìm thấy bộ thẻ</div>
        <p className="text-muted-foreground">Bộ thẻ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <div className="flex justify-center gap-3">
          <Link
            to="/flashcards"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
        <h1 ref={mainHeadingRef} id="main-content" tabIndex={-1} className="text-xl font-semibold">Bộ thẻ trống</h1>
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
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRegionRef}>
        Đang hiển thị thẻ {currentIndex + 1} trong {total}. Đã xem {viewedCards.size} thẻ.
      </div>
      <header className="space-y-2">
        <Link to="/flashcards" className="text-sm text-muted-foreground hover:underline">&larr; Danh sách bộ thẻ</Link>
        <h1 ref={mainHeadingRef} id="main-content" tabIndex={-1} className="text-2xl font-semibold">{deck.title || 'Bộ thẻ'}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card">{deck.category || 'Chưa phân loại'}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card">{difficultyToVi(deck.difficulty)}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card">{total} thẻ</span>
        </div>
      </header>

      <section className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2" role="progressbar" aria-valuenow={viewedCards.size} aria-valuemin={0} aria-valuemax={total} aria-label={`Tiến độ: ${viewedCards.size} trên ${total} thẻ đã xem`}>
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(viewedCards.size / total) * 100}%` }}
          />
        </div>
        
        {/* Completion State */}
        {isCompleted && (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg" role="status" aria-live="polite">
            <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Chúc mừng!</h3>
            <p className="text-green-700">Bạn đã xem hết tất cả {total} thẻ trong bộ này.</p>
            <div className="mt-3">
              <Link
                to="/flashcards"
                className="inline-flex px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Xem bộ thẻ khác
              </Link>
            </div>
          </div>
        )}
        
        <div className="mx-auto max-w-xl">
          <div className="relative w-full aspect-[4/3]">
            <button
              ref={cardButtonRef}
              type="button"
              role="button"
              aria-pressed={!isFront}
              aria-label={`Thẻ ${currentIndex + 1} của ${total}. ${isFront ? 'Câu hỏi' : 'Câu trả lời'}. Nhấn Enter hoặc Space để lật thẻ.`}
              onClick={() => {
                if (keyActivatedRef.current) return; // avoid double-trigger after keydown
                handleFlip();
              }}
              onKeyDown={handleKey}
              className={`w-full h-full rounded-lg border border-border bg-card text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring grid place-items-center select-none transition-transform duration-300 ease-in-out ${
                isFlipping ? 'scale-95' : 'scale-100'
              }`}
              style={{
                transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              <span className="px-6 text-center text-lg">
                {isFront ? (current.front?.trim() || 'Đang cập nhật') : (current.back?.trim() || 'Đang cập nhật')}
              </span>
            </button>
          </div>
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
            aria-disabled={!canPrev}
            aria-label="Thẻ trước"
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Trước
          </button>
          <div className="text-sm text-muted-foreground">Thẻ {currentIndex + 1} / {total}</div>
          <button
            type="button"
            onClick={() => {
              if (!canNext) return;
              setCurrentIndex(i => Math.min(total - 1, i + 1));
              // return focus to card for seamless keyboard flow
              setTimeout(() => cardButtonRef.current?.focus(), 0);
            }}
            disabled={!canNext}
            aria-disabled={!canNext}
            aria-label="Thẻ sau"
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Sau
          </button>
        </div>
      </section>
    </div>
  );
}


