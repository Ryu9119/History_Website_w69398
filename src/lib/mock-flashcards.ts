export type FlashcardDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface FlashcardDeck {
  id: string;
  title: string;
  category: string;
  difficulty: FlashcardDifficulty;
  coverImage?: string;
  updatedAt: string;
}

export const flashcardCategories: string[] = [
  'Tất cả',
  'Thời kỳ dựng nước',
  'Thời kỳ Bắc thuộc',
  'Thời kỳ độc lập',
  'Cận đại',
  'Hiện đại',
];

export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    id: '1',
    title: 'Thời kỳ dựng nước cơ bản',
    category: 'Thời kỳ dựng nước',
    difficulty: 'Beginner',
    coverImage: '/images/placeholder.jpg',
    updatedAt: '2025-01-15',
  },
  {
    id: '2',
    title: 'Bắc thuộc: Kháng chiến tiêu biểu',
    category: 'Thời kỳ Bắc thuộc',
    difficulty: 'Intermediate',
    coverImage: '/images/placeholder.jpg',
    updatedAt: '2025-01-10',
  },
  {
    id: '3',
    title: 'Triều đại độc lập đầu tiên',
    category: 'Thời kỳ độc lập',
    difficulty: 'Beginner',
    coverImage: '/images/placeholder.jpg',
    updatedAt: '2025-01-11',
  },
  {
    id: '4',
    title: 'Cận đại: Cải cách và biến động',
    category: 'Cận đại',
    difficulty: 'Intermediate',
    coverImage: '/images/placeholder.jpg',
    updatedAt: '2025-01-05',
  },
  {
    id: '5',
    title: 'Hiện đại: Mốc lịch sử quan trọng',
    category: 'Hiện đại',
    difficulty: 'Advanced',
    coverImage: '/images/placeholder.jpg',
    updatedAt: '2025-01-02',
  },
  {
    id: '6',
    title: 'Thời kỳ dựng nước nâng cao',
    category: 'Thời kỳ dựng nước',
    difficulty: 'Advanced',
    updatedAt: '2025-01-18',
  },
];


