export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl?: string;
  createdAt: string; // ISO date
}

export const blogCategories: string[] = [
  "Tất cả",
  "Lịch sử Việt Nam",
  "Thế giới",
  "Nhân vật",
  "Sự kiện",
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "trung-sinh-lich-su-viet-nam",
    title: "Trung sinh lịch sử Việt Nam",
    excerpt: "Khám phá giai đoạn chuyển tiếp đầy biến động trong lịch sử dân tộc...",
    category: "Lịch sử Việt Nam",
    coverUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2025-01-05T09:00:00.000Z",
  },
  {
    id: "2",
    slug: "nhung-de-che-hung-manh",
    title: "Những đế chế hùng mạnh trong lịch sử thế giới",
    excerpt: "Từ La Mã đến Ottoman: bài học về sự thịnh vượng và suy tàn...",
    category: "Thế giới",
    coverUrl: "https://images.unsplash.com/photo-1520975940478-6c1d5bc7b83b?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2025-02-12T12:00:00.000Z",
  },
  {
    id: "3",
    slug: "chan-dung-anh-hung",
    title: "Chân dung những anh hùng dân tộc",
    excerpt: "Gương sáng về lòng yêu nước và trí tuệ kiệt xuất...",
    category: "Nhân vật",
    coverUrl: "https://images.unsplash.com/photo-1600267185393-e158a98703de?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2025-03-08T10:30:00.000Z",
  },
  {
    id: "4",
    slug: "dau-moc-lich-su",
    title: "Những dấu mốc lịch sử quan trọng",
    excerpt: "Tổng hợp các sự kiện tạo bước ngoặt cho lịch sử nhân loại...",
    category: "Sự kiện",
    coverUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2025-03-21T08:15:00.000Z",
  },
  {
    id: "5",
    slug: "kham-pha-di-san",
    title: "Khám phá di sản văn hóa",
    excerpt: "Những di sản trường tồn cùng thời gian và câu chuyện phía sau...",
    category: "Thế giới",
    coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    createdAt: "2025-04-02T14:45:00.000Z",
  },
];


