export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
  rating: number;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Bộ sách lịch sử Việt Nam cổ đại",
    description: "Bộ sách giáo khoa lịch sử Việt Nam từ thời Hùng Vương đến thời kỳ Bắc thuộc",
    price: 299000,
    category: "Sách",
    image: "/images/book-ancient.jpg",
    createdAt: "2025-01-15T10:00:00Z",
    rating: 4.8
  },
  {
    id: 2,
    name: "Flashcard triều đại phong kiến",
    description: "Bộ thẻ học về các triều đại phong kiến Việt Nam với hình ảnh minh họa",
    price: 150000,
    category: "Flashcard",
    image: "/images/flashcard-dynasty.jpg",
    createdAt: "2025-01-20T14:30:00Z",
    rating: 4.6
  },
  {
    id: 3,
    name: "Bản đồ lịch sử tương tác",
    description: "Bản đồ tương tác thể hiện sự thay đổi lãnh thổ qua các thời kỳ lịch sử",
    price: 450000,
    category: "Bản đồ",
    image: "/images/map-interactive.jpg",
    createdAt: "2025-01-10T09:15:00Z",
    rating: 4.9
  },
  {
    id: 4,
    name: "Truyện tranh lịch sử - Hai Bà Trưng",
    description: "Truyện tranh về cuộc khởi nghĩa Hai Bà Trưng với hình ảnh đẹp mắt",
    price: 120000,
    category: "Truyện tranh",
    image: "/images/comic-trung.jpg",
    createdAt: "2025-01-25T16:45:00Z",
    rating: 4.7
  },
  {
    id: 5,
    name: "Bộ game board lịch sử",
    description: "Game board về các sự kiện lịch sử quan trọng của Việt Nam",
    price: 380000,
    category: "Game",
    image: "/images/game-board.jpg",
    createdAt: "2025-01-05T11:20:00Z",
    rating: 4.5
  },
  {
    id: 6,
    name: "Sách bài tập lịch sử lớp 10",
    description: "Sách bài tập bổ trợ cho chương trình lịch sử lớp 10",
    price: 85000,
    category: "Sách",
    image: "/images/workbook-10.jpg",
    createdAt: "2025-01-18T13:10:00Z",
    rating: 4.4
  },
  {
    id: 7,
    name: "Bộ thẻ học về các anh hùng dân tộc",
    description: "Thẻ học về các anh hùng dân tộc Việt Nam qua các thời kỳ",
    price: 180000,
    category: "Flashcard",
    image: "/images/flashcard-heroes.jpg",
    createdAt: "2025-01-22T15:30:00Z",
    rating: 4.8
  },
  {
    id: 8,
    name: "Truyện tranh lịch sử - Lý Thường Kiệt",
    description: "Truyện tranh về danh tướng Lý Thường Kiệt và chiến thắng sông Như Nguyệt",
    price: 110000,
    category: "Truyện tranh",
    image: "/images/comic-ly.jpg",
    createdAt: "2025-01-12T10:45:00Z",
    rating: 4.6
  }
];

export const productCategories = [
  "Tất cả",
  "Sách",
  "Flashcard", 
  "Bản đồ",
  "Truyện tranh",
  "Game"
];

export const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "rating", label: "Đánh giá cao nhất" }
];
