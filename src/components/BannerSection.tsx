import React from 'react';
import { BookOpen, Lightbulb, Smartphone } from 'lucide-react';

const BannerSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Học tập tương tác</h3>
            <p className="text-muted-foreground">Phương pháp học tập hiện đại và thú vị</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Nội dung chất lượng</h3>
            <p className="text-muted-foreground">Được biên soạn bởi các chuyên gia lịch sử</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Học mọi lúc mọi nơi</h3>
            <p className="text-muted-foreground">Truy cập dễ dàng trên mọi thiết bị</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
