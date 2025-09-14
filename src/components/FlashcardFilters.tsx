import { FlashcardDifficulty } from '@/lib/mock-flashcards';

function difficultyToVi(d: FlashcardDifficulty): string {
  switch (d) {
    case 'Beginner':
      return 'Cơ bản';
    case 'Intermediate':
      return 'Trung cấp';
    case 'Advanced':
      return 'Nâng cao';
    default:
      return String(d);
  }
}

interface FlashcardFiltersProps {
  categories: string[];
  selectedCategory: string;
  onChangeCategory: (c: string) => void;
  selectedDifficulty: FlashcardDifficulty | 'Tất cả';
  onChangeDifficulty: (d: FlashcardDifficulty | 'Tất cả') => void;
  onClear: () => void;
}

export const FlashcardFilters = ({
  categories,
  selectedCategory,
  onChangeCategory,
  selectedDifficulty,
  onChangeDifficulty,
  onClear,
}: FlashcardFiltersProps) => {
  // Check if filters are at default state
  const isDefaultState = selectedCategory === 'Tất cả' && selectedDifficulty === 'Tất cả';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="category-filter" className="text-sm font-medium text-foreground">
          Danh mục
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onChangeCategory(e.target.value)}
          className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200"
          aria-label="Lọc theo danh mục"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="difficulty-filter" className="text-sm font-medium text-foreground">
          Độ khó
        </label>
        <select
          id="difficulty-filter"
          value={selectedDifficulty}
          onChange={(e) => onChangeDifficulty(e.target.value as FlashcardDifficulty | 'Tất cả')}
          className="w-full bg-card text-foreground border border-border rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200"
          aria-label="Lọc theo độ khó"
        >
          <option value={'Tất cả'}>{'Tất cả'}</option>
          {(['Beginner','Intermediate','Advanced'] as FlashcardDifficulty[]).map((d) => (
            <option key={d} value={d}>{difficultyToVi(d)}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={onClear}
          disabled={isDefaultState}
          className="w-full bg-transparent border border-border text-foreground px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground"
          aria-label="Xóa tất cả bộ lọc"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};



