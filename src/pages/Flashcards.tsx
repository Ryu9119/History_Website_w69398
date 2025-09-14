import React, { useRef, useEffect } from 'react';
import Header from '../components/Header';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useFlashcards } from '@/hooks/useFlashcards';
import { FlashcardFilters } from '@/components/FlashcardFilters';
import { DeckCard } from '@/components/DeckCard';

const Flashcards = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const {
    decks,
    isLoading,
    isError,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    clearFilters,
    categories,
  } = useFlashcards();

  // Focus management when filters change
  useEffect(() => {
    if (gridRef.current && !isLoading) {
      // Use requestAnimationFrame to ensure smooth focus transition
      requestAnimationFrame(() => {
        gridRef.current?.focus();
        window.scrollTo(0, 0);
      });
    }
  }, [selectedCategory, selectedDifficulty, isLoading]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? 'Đang tải bộ thẻ...' : ''}
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Bộ thẻ học lịch sử
        </h1>

        <div className="mb-8">
          <FlashcardFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
            onClear={clearFilters}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded animate-pulse w-20" />
                    <div className="h-4 bg-muted rounded animate-pulse w-16" />
                  </div>
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState 
            className="mt-8" 
            onRetry={clearFilters}
            title="Không thể tải danh sách bộ thẻ"
            description="Đã xảy ra lỗi khi tải danh sách bộ thẻ. Vui lòng thử lại."
          />
        )}

        {!isLoading && !isError && decks.length === 0 && (
          <EmptyState 
            type="no-flashcards-results" 
            className="mt-8" 
            onClearFilters={clearFilters} 
          />
        )}

        {!isLoading && !isError && decks.length > 0 && (
          <div 
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            tabIndex={-1}
            role="region"
            aria-label="Danh sách bộ thẻ học lịch sử"
          >
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
