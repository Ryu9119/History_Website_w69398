import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { flashcardCategories, mockFlashcardDecks, FlashcardDeck, FlashcardDifficulty } from '@/lib/mock-flashcards';

export interface UseFlashcardsState {
  decks: FlashcardDeck[];
  isLoading: boolean;
  isError: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDifficulty: FlashcardDifficulty | 'Tất cả';
  setSelectedDifficulty: (difficulty: FlashcardDifficulty | 'Tất cả') => void;
  clearFilters: () => void;
  categories: string[];
}

const LOADING_MS = 700;

export function useFlashcards(): UseFlashcardsState {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FlashcardDifficulty | 'Tất cả'>('Tất cả');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    const searchParams = new URLSearchParams(location.search);
    const shouldForceError = searchParams.get('error') === '1';

    const timer = setTimeout(() => {
      if (!isMounted) return;
      if (shouldForceError) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }, LOADING_MS);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location.search]);

  const filteredDecks = useMemo(() => {
    let list = mockFlashcardDecks;
    if (selectedCategory !== 'Tất cả') {
      list = list.filter(d => d.category === selectedCategory);
    }
    if (selectedDifficulty !== 'Tất cả') {
      list = list.filter(d => d.difficulty === selectedDifficulty);
    }
    return list;
  }, [selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedDifficulty('Tất cả');
  };

  return {
    decks: filteredDecks,
    isLoading,
    isError,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    clearFilters,
    categories: flashcardCategories,
  };
}



