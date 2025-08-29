import React from 'react';
import { cn } from '../lib/utils';

interface ProductSectionProps {
  isHomePage?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ isHomePage = false }) => {
  return (
    <section className={cn("py-16 bg-background")}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={cn("text-3xl font-bold mb-4 text-foreground")}>Sản phẩm nổi bật</h2>
          <p className={cn("text-muted-foreground max-w-2xl mx-auto")}>
            Khám phá các sản phẩm giáo dục lịch sử chất lượng cao, được thiết kế để giúp việc học tập trở nên thú vị và hiệu quả
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Product Card 1 */}
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Bộ sách lịch sử</h3>
              <p className={cn("text-muted-foreground mb-4")}>Bộ sách giáo khoa lịch sử Việt Nam từ cổ đại đến hiện đại</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">299.000đ</span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Flashcard lịch sử</h3>
              <p className={cn("text-muted-foreground mb-4")}>Bộ thẻ học lịch sử tương tác với hình ảnh minh họa</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">199.000đ</span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 3 */}
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Video bài giảng</h3>
              <p className={cn("text-muted-foreground mb-4")}>Bộ video bài giảng lịch sử với hình ảnh và âm thanh chất lượng cao</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">399.000đ</span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Xem chi tiết
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
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
