export interface FlashcardCard {
  id: string;
  deckId: string;
  front: string;
  back: string;
}

// Simple mock cards per deck. Keep content concise and local-only.
export const mockFlashcardCards: FlashcardCard[] = [
  // Deck 1
  { id: '1-1', deckId: '1', front: 'Nước Văn Lang do ai lập?', back: 'Vua Hùng - khoảng thế kỷ VII TCN.' },
  { id: '1-2', deckId: '1', front: 'Kinh đô đầu tiên của Văn Lang?', back: 'Phong Châu (Phú Thọ).' },
  { id: '1-3', deckId: '1', front: 'Đặc trưng kinh tế thời Hùng Vương?', back: 'Nông nghiệp lúa nước, công cụ đồng thau.' },

  // Deck 2
  { id: '2-1', deckId: '2', front: 'Thời Bắc thuộc kéo dài khoảng?', back: 'Hơn 1.000 năm (179 TCN - 938).' },
  { id: '2-2', deckId: '2', front: 'Khởi nghĩa Hai Bà Trưng năm?', back: 'Năm 40.' },
  { id: '2-3', deckId: '2', front: 'Ngô Quyền chiến thắng ở đâu năm 938?', back: 'Bạch Đằng.' },

  // Deck 3
  { id: '3-1', deckId: '3', front: 'Triều đại độc lập đầu tiên?', back: 'Nhà Ngô (939–965).'},
  { id: '3-2', deckId: '3', front: 'Kinh đô thời Đinh?', back: 'Hoa Lư.' },
  { id: '3-3', deckId: '3', front: 'Vua Lê Đại Hành thuộc triều?', back: 'Nhà Tiền Lê.' },

  // Deck 4
  { id: '4-1', deckId: '4', front: 'Phong trào Cần Vương nổ ra năm?', back: '1885.' },
  { id: '4-2', deckId: '4', front: 'Đề xuất cải cách nổi bật cuối thế kỷ XIX?', back: 'Nguyễn Trường Tộ, Phạm Phú Thứ…' },
  { id: '4-3', deckId: '4', front: 'Sự kiện 1858?', back: 'Liên quân Pháp – Tây Ban Nha tấn công Đà Nẵng.' },

  // Deck 5
  { id: '5-1', deckId: '5', front: 'Cách mạng Tháng Tám năm?', back: '1945.' },
  { id: '5-2', deckId: '5', front: 'Chiến thắng Điện Biên Phủ năm?', back: '1954.' },
  { id: '5-3', deckId: '5', front: 'Thống nhất đất nước năm?', back: '1975.' },

  // Deck 6
  { id: '6-1', deckId: '6', front: 'Truyền thuyết tiêu biểu thời dựng nước?', back: 'Sơn Tinh – Thủy Tinh, Thánh Gióng…' },
  { id: '6-2', deckId: '6', front: 'Đặc trưng xã hội Văn Lang – Âu Lạc?', back: 'Bộ lạc, lạc hầu, lạc tướng, công xã nông thôn.' },
  { id: '6-3', deckId: '6', front: 'Thành Cổ Loa thuộc thời nào?', back: 'Âu Lạc – An Dương Vương.' },
];


