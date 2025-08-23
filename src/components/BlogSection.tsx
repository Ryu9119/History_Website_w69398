import React from 'react';

interface BlogSectionProps {
  isHomePage?: boolean;
}

const BlogSection: React.FC<BlogSectionProps> = ({ isHomePage = false }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Blog lịch sử</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những câu chuyện lịch sử thú vị, những sự kiện quan trọng và những nhân vật lịch sử nổi tiếng của Việt Nam
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Blog Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Vua Hùng và nước Văn Lang</h3>
              <p className="text-gray-600 mb-4">Tìm hiểu về thời kỳ dựng nước đầu tiên của dân tộc Việt Nam</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">15/08/2024</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Hai Bà Trưng khởi nghĩa</h3>
              <p className="text-gray-600 mb-4">Câu chuyện về cuộc khởi nghĩa chống Bắc thuộc đầu tiên</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">12/08/2024</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>

          {/* Blog Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Ngô Quyền đánh quân Nam Hán</h3>
              <p className="text-gray-600 mb-4">Chiến thắng Bạch Đằng và sự độc lập của nước ta</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">10/08/2024</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Đọc thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        {isHomePage && (
          <div className="text-center">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
