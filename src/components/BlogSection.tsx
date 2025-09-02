import React from 'react';
import { cn } from '../lib/utils';

interface BlogSectionProps {
  isHomePage?: boolean;
}

const BlogSection: React.FC<BlogSectionProps> = ({ isHomePage = false }) => {
  return (
    <section className={cn("py-16 bg-muted")}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={cn("text-3xl font-bold mb-4 text-foreground")}>Blog lịch sử</h2>
          <p className={cn("text-muted-foreground max-w-2xl mx-auto")}>
            Khám phá những câu chuyện lịch sử thú vị và những bài viết chuyên sâu về lịch sử Việt Nam
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Cuộc khởi nghĩa Hai Bà Trưng</h3>
              <p className={cn("text-muted-foreground mb-4")}>Tìm hiểu về cuộc khởi nghĩa chống Bắc thuộc đầu tiên trong lịch sử Việt Nam</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm text-muted-foreground")}>
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Chiến thắng Bạch Đằng</h3>
              <p className={cn("text-muted-foreground mb-4")}>Khám phá chiến thuật thông minh của Ngô Quyền trong trận Bạch Đằng</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm text-muted-foreground")}>
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Văn hóa Đông Sơn</h3>
              <p className={cn("text-muted-foreground mb-4")}>Tìm hiểu về nền văn hóa đồ đồng nổi tiếng của người Việt cổ</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm text-muted-foreground")}>
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>
        </div>
        {isHomePage && (
          <div className="text-center">
            <button className={cn(
              "bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors",
              "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            )}>
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
