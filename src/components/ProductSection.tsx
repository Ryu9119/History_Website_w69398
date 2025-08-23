import React from 'react';

interface ProductSectionProps {
  isHomePage?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ isHomePage = false }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các sản phẩm giáo dục lịch sử chất lượng cao, được thiết kế để giúp việc học tập trở nên thú vị và hiệu quả
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Product Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bộ sách lịch sử</h3>
              <p className="text-gray-600 mb-4">Bộ sách giáo khoa lịch sử Việt Nam từ cổ đại đến hiện đại</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-red-600">299.000đ</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Flashcard lịch sử</h3>
              <p className="text-gray-600 mb-4">Bộ thẻ học lịch sử tương tác với hình ảnh minh họa</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-red-600">199.000đ</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Video bài giảng</h3>
              <p className="text-gray-600 mb-4">Bộ video bài giảng lịch sử với hình ảnh và âm thanh chất lượng cao</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-red-600">399.000đ</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        {isHomePage && (
          <div className="text-center">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
