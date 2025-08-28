import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User as UserIcon, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Blog lịch sử', href: '/blog' },
    { name: 'Flash Card', href: '/flashcards' },
    { name: 'Chatbot AI', href: '/chatbot', icon: MessageCircle },
    { name: 'Đăng nhập', href: '/login', icon: UserIcon },
    { name: 'Admin', href: '/admin', icon: UserIcon },
  ];

  return (
    <header className="bg-red-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.svg" alt="Thiên Sử Ký Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-bold text-red-100">Thiên Sử Ký</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 hover:text-red-300 transition-colors duration-200 font-medium"
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-red-800 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-red-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
