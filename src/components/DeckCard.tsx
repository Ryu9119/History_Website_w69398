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
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={deck.coverImage || '/images/placeholder-cover.svg'}
          alt={`Bộ thẻ: ${deck.title}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = '/images/placeholder-cover.svg'; 
          }}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {deck.category}
          </span>
          <span className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
            {difficultyToVi(deck.difficulty)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 leading-tight">
          {deck.title}
        </h3>
        <Link
          to={`/flashcards/${deck.id}`}
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded font-medium transition-colors duration-200"
          aria-label={`Mở bộ thẻ ${deck.title}`}
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
};


