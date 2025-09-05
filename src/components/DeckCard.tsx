import { Link } from 'react-router-dom';
import { FlashcardDeck } from '@/lib/mock-flashcards';

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

interface DeckCardProps {
  deck: FlashcardDeck;
}

export const DeckCard = ({ deck }: DeckCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={deck.coverImage || '/images/placeholder-cover.svg'}
          alt={`Bộ thẻ: ${deck.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-cover.svg'; }}
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {deck.category}
          </span>
          <span className="text-xs px-2 py-0.5 rounded border border-border text-foreground">
            {difficultyToVi(deck.difficulty)}
          </span>
        </div>
        <h3 className="text-base font-semibold text-card-foreground">{deck.title}</h3>
        <Link
          to={`/flashcards/${deck.id}`}
          className="inline-flex items-center text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label={`Mở bộ thẻ ${deck.title}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};


