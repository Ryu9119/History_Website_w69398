import React from 'react';
import { cn } from '../lib/utils';

const Hero = () => {
  return (
    <section className={cn("bg-gradient-to-r from-red-600 to-red-800 text-white py-20")}>
      <div className="container mx-auto px-4 text-center">
        <h1 className={cn("text-5xl font-bold mb-6 text-foreground-inverted")}>
          Khám phá lịch sử Việt Nam
        </h1>
        <p className={cn("text-xl mb-8 max-w-2xl mx-auto opacity-90")}>
          Học lịch sử một cách thú vị và tương tác thông qua các sản phẩm giáo dục chất lượng cao
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className={cn(
            "bg-background text-primary px-8 py-3 rounded-lg font-semibold transition-colors",
            "hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
          )}>
            Khám phá ngay
          </button>
          <button className={cn(
            "border-2 border-background text-white px-8 py-3 rounded-lg font-semibold transition-colors",
            "hover:bg-background hover:text-primary focus:bg-background focus:text-primary",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}>
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
