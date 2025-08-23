import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Khám phá lịch sử Việt Nam
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Học lịch sử một cách thú vị và tương tác thông qua các sản phẩm giáo dục chất lượng cao
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Khám phá ngay
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
