import React from 'react';
import { cn } from '../lib/utils';

const Footer = () => {
  return (
    <footer className={cn("bg-gradient-to-r from-red-800 to-red-900 text-white")}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.svg" alt="Thiên Sử Ký Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold text-white/90">Thiên Sử Ký</span>
            </div>
            <p className={cn("text-red-100 mb-4 text-muted-foreground")}>
              Chuyên cung cấp các sản phẩm giáo dục lịch sử chất lượng cao, giúp học sinh và người yêu lịch sử 
              khám phá và hiểu sâu hơn về lịch sử Việt Nam.
            </p>
            <div className={cn("space-y-2 text-red-100 text-muted-foreground")}>
              <p>📧 Email: info@thiensuky.com</p>
              <p>📞 Hotline: 1900-1234</p>
              <p>📍 Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-red-100 hover:text-white transition-colors">Trang chủ</a></li>
              <li><a href="/products" className="text-red-100 hover:text-white transition-colors">Sản phẩm</a></li>
              <li><a href="/blog" className="text-red-100 hover:text-white transition-colors">Blog lịch sử</a></li>
              <li><a href="/flashcards" className="text-red-100 hover:text-white transition-colors">Flash Card</a></li>
              <li><a href="/chatbot" className="text-red-100 hover:text-white transition-colors">Chatbot AI</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-red-100 hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="/contact" className="text-red-100 hover:text-white transition-colors">Liên hệ</a></li>
              <li><a href="/faq" className="text-red-100 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/privacy" className="text-red-100 hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="/terms" className="text-red-100 hover:text-white transition-colors">Điều khoản sử dụng</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn("border-t border-red-800 mt-8 pt-8 text-center border-border/20")}>
          <p className={cn("text-red-100 text-muted-foreground")}>
            © {new Date().getFullYear()} Thiên Sử Ký. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
