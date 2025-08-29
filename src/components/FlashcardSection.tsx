import React from 'react';
import { cn } from '../lib/utils';

interface FlashcardSectionProps {
  isHomePage?: boolean;
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ isHomePage = false }) => {
  return (
    <section className={cn("py-16 bg-background")}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={cn("text-3xl font-bold mb-4 text-foreground")}>Flashcard lịch sử</h2>
          <p className={cn("text-muted-foreground max-w-2xl mx-auto")}>
            Học lịch sử một cách tương tác và thú vị với bộ thẻ học được thiết kế đặc biệt cho từng chủ đề lịch sử
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Flashcard Category 1 */}
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Thời kỳ dựng nước</h3>
              <p className={cn("text-muted-foreground mb-4")}>Từ Vua Hùng đến An Dương Vương</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm text-muted-foreground")}>50 thẻ</span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Học ngay
                </button>
              </div>
            </div>
          </div>

          {/* Flashcard Category 2 */}
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Thời kỳ Bắc thuộc</h3>
              <p className={cn("text-muted-foreground mb-4")}>Từ Hai Bà Trưng đến Ngô Quyền</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm text-muted-foreground")}>75 thẻ</span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Học ngay
                </button>
              </div>
            </div>
          </div>

          {/* Flashcard Category 3 */}
          <div className={cn("bg-card border border-border rounded-lg shadow-lg overflow-hidden")}>
            <div className={cn("h-48 bg-muted flex items-center justify-center")}>
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className={cn("text-xl font-semibold mb-2 text-card-foreground")}>Thời kỳ độc lập</h3>
              <p className={cn("text-muted-foreground mb-4")}>Từ Đinh Bộ Lĩnh đến Lê Lợi</p>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm text-muted-foreground")}>100 thẻ</span>
                <button className={cn(
                  "bg-primary text-primary-foreground px-4 py-2 rounded transition-colors",
                  "hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                )}>
                  Học ngay
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
              Xem tất cả flashcard
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashcardSection;
