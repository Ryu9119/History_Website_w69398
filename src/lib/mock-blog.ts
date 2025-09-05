export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl?: string;
  createdAt: string; // ISO date
  author: string;
  readTime: number; // minutes
  updatedAt: string; // ISO date
  content: BlogContentBlock[];
}

export interface BlogContentBlock {
  type: 'paragraph' | 'heading2' | 'heading3' | 'list';
  content: string | string[];
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
    coverUrl: "/images/placeholder.jpg",
    createdAt: "2025-01-05T09:00:00.000Z",
    author: "Nguyễn Văn A",
    readTime: 8,
    updatedAt: "2025-01-05T09:00:00.000Z",
    content: [
      {
        type: "paragraph",
        content: "Lịch sử Việt Nam trải qua nhiều giai đoạn thăng trầm, mỗi thời kỳ đều để lại những dấu ấn sâu đậm trong tiến trình phát triển của dân tộc. Giai đoạn trung sinh là một trong những thời kỳ quan trọng nhất, đánh dấu sự chuyển biến từ thời kỳ cổ đại sang thời kỳ cận đại."
      },
      {
        type: "heading2",
        content: "Bối cảnh lịch sử"
      },
      {
        type: "paragraph",
        content: "Vào thế kỷ X-XV, Việt Nam bước vào giai đoạn độc lập tự chủ sau hơn 1000 năm Bắc thuộc. Đây là thời kỳ các triều đại Lý, Trần, Lê sơ xây dựng và củng cố nền độc lập dân tộc."
      },
      {
        type: "heading3",
        content: "Triều đại Lý (1009-1225)"
      },
      {
        type: "paragraph",
        content: "Triều Lý được thành lập bởi Lý Công Uẩn, mở ra thời kỳ thịnh vượng với việc dời đô về Thăng Long. Đây là thời kỳ phát triển mạnh mẽ về văn hóa, giáo dục và quân sự."
      },
      {
        type: "list",
        content: [
          "Thành lập Quốc Tử Giám (1070)",
          "Tổ chức khoa cử (1075)",
          "Xây dựng Văn Miếu (1070)",
          "Phát triển Phật giáo"
        ]
      },
      {
        type: "heading3",
        content: "Triều đại Trần (1225-1400)"
      },
      {
        type: "paragraph",
        content: "Triều Trần nổi tiếng với ba lần đánh thắng quân Nguyên Mông, thể hiện tinh thần đoàn kết dân tộc và tài năng quân sự kiệt xuất."
      },
      {
        type: "heading2",
        content: "Di sản văn hóa"
      },
      {
        type: "paragraph",
        content: "Giai đoạn trung sinh để lại nhiều di sản văn hóa quý giá, từ kiến trúc đến văn học, nghệ thuật. Những công trình như chùa Một Cột, tháp Bình Sơn vẫn còn tồn tại đến ngày nay."
      }
    ]
  },
  {
    id: "2",
    slug: "nhung-de-che-hung-manh",
    title: "Những đế chế hùng mạnh trong lịch sử thế giới",
    excerpt: "Từ La Mã đến Ottoman: bài học về sự thịnh vượng và suy tàn...",
    category: "Thế giới",
    coverUrl: "/images/placeholder.jpg",
    createdAt: "2025-02-12T12:00:00.000Z",
    author: "Trần Thị B",
    readTime: 12,
    updatedAt: "2025-02-12T12:00:00.000Z",
    content: [
      {
        type: "paragraph",
        content: "Lịch sử thế giới chứng kiến sự trỗi dậy và suy tàn của nhiều đế chế hùng mạnh. Mỗi đế chế đều để lại những bài học quý giá về quản trị, văn hóa và sự phát triển của nhân loại."
      },
      {
        type: "heading2",
        content: "Đế chế La Mã"
      },
      {
        type: "paragraph",
        content: "Đế chế La Mã là một trong những đế chế vĩ đại nhất trong lịch sử, tồn tại từ năm 27 TCN đến năm 476 SCN. La Mã đã xây dựng một hệ thống chính trị, quân sự và văn hóa ảnh hưởng sâu sắc đến châu Âu."
      },
      {
        type: "list",
        content: [
          "Hệ thống luật pháp hoàn chỉnh",
          "Kiến trúc và kỹ thuật xây dựng",
          "Hệ thống đường sá rộng khắp",
          "Văn hóa và nghệ thuật phát triển"
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "chan-dung-anh-hung",
    title: "Chân dung những anh hùng dân tộc",
    excerpt: "Gương sáng về lòng yêu nước và trí tuệ kiệt xuất...",
    category: "Nhân vật",
    coverUrl: "/images/placeholder.jpg",
    createdAt: "2025-03-08T10:30:00.000Z",
    author: "Lê Văn C",
    readTime: 10,
    updatedAt: "2025-03-08T10:30:00.000Z",
    content: [
      {
        type: "paragraph",
        content: "Lịch sử Việt Nam ghi nhận nhiều anh hùng dân tộc với những chiến công hiển hách và đức tính cao đẹp. Họ là những tấm gương sáng về lòng yêu nước, trí tuệ và đạo đức."
      },
      {
        type: "heading2",
        content: "Hai Bà Trưng"
      },
      {
        type: "paragraph",
        content: "Hai Bà Trưng là những nữ anh hùng đầu tiên trong lịch sử dân tộc, lãnh đạo cuộc khởi nghĩa chống quân Đông Hán vào năm 40-43."
      }
    ]
  },
  {
    id: "4",
    slug: "dau-moc-lich-su",
    title: "Những dấu mốc lịch sử quan trọng",
    excerpt: "Tổng hợp các sự kiện tạo bước ngoặt cho lịch sử nhân loại...",
    category: "Sự kiện",
    coverUrl: "/images/placeholder.jpg",
    createdAt: "2025-03-21T08:15:00.000Z",
    author: "Phạm Thị D",
    readTime: 15,
    updatedAt: "2025-03-21T08:15:00.000Z",
    content: [
      {
        type: "paragraph",
        content: "Lịch sử nhân loại được đánh dấu bởi những sự kiện quan trọng, những dấu mốc tạo nên bước ngoặt trong tiến trình phát triển của xã hội loài người."
      },
      {
        type: "heading2",
        content: "Cách mạng Công nghiệp"
      },
      {
        type: "paragraph",
        content: "Cách mạng Công nghiệp (1760-1840) đã thay đổi hoàn toàn cách thức sản xuất và tổ chức xã hội, mở ra kỷ nguyên hiện đại."
      }
    ]
  },
  {
    id: "5",
    slug: "kham-pha-di-san",
    title: "Khám phá di sản văn hóa",
    excerpt: "Những di sản trường tồn cùng thời gian và câu chuyện phía sau...",
    category: "Thế giới",
    coverUrl: "/images/placeholder.jpg",
    createdAt: "2025-04-02T14:45:00.000Z",
    author: "Hoàng Văn E",
    readTime: 9,
    updatedAt: "2025-04-02T14:45:00.000Z",
    content: [
      {
        type: "paragraph",
        content: "Di sản văn hóa là những giá trị tinh thần và vật chất được truyền từ thế hệ này sang thế hệ khác, thể hiện bản sắc và truyền thống của mỗi dân tộc."
      },
      {
        type: "heading2",
        content: "Di sản thế giới"
      },
      {
        type: "paragraph",
        content: "UNESCO đã công nhận nhiều di sản văn hóa và thiên nhiên trên khắp thế giới, góp phần bảo tồn và phát huy giá trị của nhân loại."
      }
    ]
  },
];


