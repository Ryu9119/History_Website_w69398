import React from 'react';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Khám phá
              <span className="block text-red-300">Lịch sử Việt Nam</span>
            </h1>
            <p className="text-xl text-red-100 leading-relaxed">
              Thiên Sử Ký mang đến cho bạn những sản phẩm giáo dục độc đáo về lịch sử Việt Nam 
              qua board game, mô hình và flashcard học tập hiện đại.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105">
                <span>Khám phá ngay</span>
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-red-300 text-red-100 hover:bg-red-300 hover:text-red-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Xem video giới thiệu
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-red-800/50 backdrop-blur-sm p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
              <BookOpen className="mx-auto mb-4 text-red-300" size={48} />
              <h3 className="text-2xl font-bold mb-2">1000+</h3>
              <p className="text-red-200">Bài viết lịch sử</p>
            </div>
            <div className="bg-red-800/50 backdrop-blur-sm p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
              <Users className="mx-auto mb-4 text-red-300" size={48} />
              <h3 className="text-2xl font-bold mb-2">50K+</h3>
              <p className="text-red-200">Người học</p>
            </div>
            <div className="bg-red-800/50 backdrop-blur-sm p-6 rounded-xl text-center col-span-2 transform hover:scale-105 transition-transform duration-300">
              <Award className="mx-auto mb-4 text-red-300" size={48} />
              <p className="text-red-200">Để lịch sử không chỉ là chuyện kể mà còn là lời hứa tiếp nối</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
