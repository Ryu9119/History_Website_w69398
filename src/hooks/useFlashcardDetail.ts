import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { type FlashcardDeck, mockFlashcardDecks } from '@/lib/mock-flashcards';
import { mockFlashcardCards, type FlashcardCard } from '@/lib/mock-flashcard-cards';

interface UseFlashcardDetailResult {
  deck: FlashcardDeck | null;
  cards: FlashcardCard[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useFlashcardDetail(deckId: string): UseFlashcardDetailResult {
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<FlashcardCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldForceError = import.meta.env.DEV && searchParams.get('error') === '1';
  const shouldSlow = import.meta.env.DEV && searchParams.get('slow') === '1';
  const shouldForceEmpty = import.meta.env.DEV && searchParams.get('empty') === '1';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    const delayMs = shouldSlow ? 900 + Math.floor(Math.random() * 300) : 700;
    const timer = setTimeout(() => {
      if (!isMounted) return;

      if (shouldForceError) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      if (shouldForceEmpty) {
        setDeck(null);
        setCards([]);
        setIsLoading(false);
        return;
      }

      const foundDeck = mockFlashcardDecks.find(d => d.id === deckId) || null;
      // Skip malformed cards defensively
      const deckCards = mockFlashcardCards
        .filter(c => c.deckId === deckId)
        .filter(c => c && typeof c.front === 'string' && typeof c.back === 'string');

      setDeck(foundDeck);
      setCards(deckCards);
      setIsLoading(false);
    }, delayMs);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [deckId, reloadKey, shouldForceError, shouldSlow, shouldForceEmpty, location.search]);

  // Keep API shape simple but allow consumers to derive counts
  const retry = () => setReloadKey(k => k + 1);

  return { deck, cards, isLoading, isError, retry };
}


