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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Danh mục</span>
        <select
          value={selectedCategory}
          onChange={(e) => onChangeCategory(e.target.value)}
          className="w-full bg-card text-foreground border border-border rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Lọc theo danh mục"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Độ khó</span>
        <select
          value={selectedDifficulty}
          onChange={(e) => onChangeDifficulty(e.target.value as FlashcardDifficulty | 'Tất cả')}
          className="w-full bg-card text-foreground border border-border rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Lọc theo độ khó"
        >
          <option value={'Tất cả'}>{'Tất cả'}</option>
          {(['Beginner','Intermediate','Advanced'] as FlashcardDifficulty[]).map((d) => (
            <option key={d} value={d}>{difficultyToVi(d)}</option>
          ))}
        </select>
      </label>

      <div className="flex items-end">
        <button
          onClick={onClear}
          className="w-full bg-transparent border border-border text-foreground px-3 py-2 rounded hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};



