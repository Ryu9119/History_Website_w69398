import React from 'react';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';

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
          <Button variant="secondary" size="lg">
            Khám phá ngay
          </Button>
          <Button variant="ghost" size="lg" className={cn("border-2 border-white text-white hover:bg-accent hover:text-accent-foreground")}> 
            Tìm hiểu thêm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
