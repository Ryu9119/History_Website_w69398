import { useEffect, useMemo, useState } from 'react';
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
  const shouldForceError = searchParams.get('error') === '1';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    const timer = setTimeout(() => {
      if (!isMounted) return;

      if (shouldForceError) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const foundDeck = mockFlashcardDecks.find(d => d.id === deckId) || null;
      const deckCards = mockFlashcardCards.filter(c => c.deckId === deckId);

      setDeck(foundDeck);
      setCards(deckCards);
      setIsLoading(false);
    }, 700);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [deckId, reloadKey, shouldForceError, location.search]);

  const cardCount = useMemo(() => cards.length, [cards]);
  // Keep API shape simple but allow consumers to derive counts
  const retry = () => setReloadKey(k => k + 1);

  return { deck, cards, isLoading, isError, retry };
}


