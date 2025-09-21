export type FlashcardDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface FlashcardDeck {
  id: string;
  title: string;
  category: string;
  difficulty: FlashcardDifficulty;
  coverImage?: string;
  description: string;
  cardCount: number;
  estimatedTime: number;
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
    description: 'Học về các triều đại đầu tiên của Việt Nam, từ Hùng Vương đến An Dương Vương.',
    cardCount: 25,
    estimatedTime: 15,
    updatedAt: '2025-01-15',
  },
  {
    id: '2',
    title: 'Bắc thuộc: Kháng chiến tiêu biểu',
    category: 'Thời kỳ Bắc thuộc',
    difficulty: 'Intermediate',
    coverImage: '/images/placeholder.jpg',
    description: 'Tìm hiểu về các cuộc khởi nghĩa chống Bắc thuộc như Hai Bà Trưng, Bà Triệu.',
    cardCount: 35,
    estimatedTime: 20,
    updatedAt: '2025-01-10',
  },
  {
    id: '3',
    title: 'Triều đại độc lập đầu tiên',
    category: 'Thời kỳ độc lập',
    difficulty: 'Beginner',
    coverImage: '/images/placeholder.jpg',
    description: 'Khám phá các triều đại Ngô, Đinh, Tiền Lê và sự nghiệp dựng nước.',
    cardCount: 30,
    estimatedTime: 18,
    updatedAt: '2025-01-11',
  },
  {
    id: '4',
    title: 'Cận đại: Cải cách và biến động',
    category: 'Cận đại',
    difficulty: 'Intermediate',
    coverImage: '/images/placeholder.jpg',
    description: 'Tìm hiểu về các cuộc cải cách và biến động xã hội trong thời kỳ cận đại.',
    cardCount: 40,
    estimatedTime: 25,
    updatedAt: '2025-01-05',
  },
  {
    id: '5',
    title: 'Hiện đại: Mốc lịch sử quan trọng',
    category: 'Hiện đại',
    difficulty: 'Advanced',
    coverImage: '/images/placeholder.jpg',
    description: 'Nghiên cứu về các cuộc cách mạng và quá trình giành độc lập dân tộc.',
    cardCount: 50,
    estimatedTime: 30,
    updatedAt: '2025-01-02',
  },
  {
    id: '6',
    title: 'Thời kỳ dựng nước nâng cao',
    category: 'Thời kỳ dựng nước',
    difficulty: 'Advanced',
    coverImage: '/images/placeholder.jpg',
    description: 'Nghiên cứu sâu về các triều đại đầu tiên và nền văn minh cổ đại.',
    cardCount: 45,
    estimatedTime: 28,
    updatedAt: '2025-01-18',
  },
];


