import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User as UserIcon, MessageCircle, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, User } from '../lib/auth-api';
import { cn } from '../lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Type for navigation items
  type NavItem = {
    name: string;
    href: string;
    icon?: React.ComponentType<{ size?: number | string }>;
    onClick?: () => void;
  };

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = authApi.isAuthenticated();
      const user = authApi.getCurrentUser();
      setIsAuthenticated(auth);
      setCurrentUser(user);
    };

    const handleAuthStateChange = (event: CustomEvent) => {
      setIsAuthenticated(event.detail.isAuthenticated);
      setCurrentUser(event.detail.user);
    };

    checkAuth();
    
    // Listen for custom auth state changes
    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  const navItems: NavItem[] = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Blog lịch sử', href: '/blog' },
    { name: 'Flash Card', href: '/flashcard' },
    { name: 'Chatbot AI', href: '/chatbot', icon: MessageCircle },
    { name: 'Giỏ hàng', href: '/cart', icon: ShoppingCart },
    ...(isAuthenticated 
      ? [
          { name: `Xin chào, ${currentUser?.name || 'User'}`, href: '/profile', icon: UserIcon },
          ...(currentUser?.email === 'test@example.com' ? [{ name: 'Admin', href: '/admin', icon: Settings }] : []),
          { name: 'Đăng xuất', href: '#', icon: LogOut, onClick: handleLogout }
        ]
      : [
          { name: 'Đăng nhập', href: '/login', icon: UserIcon }
        ]
    ),
  ];

  return (
    <header className={cn("bg-primary text-primary-foreground shadow-lg sticky top-0 z-50")}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="Thiên Sử Ký Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className={cn("text-2xl font-bold text-primary-foreground/90")}>Thiên Sử Ký</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center space-x-1 transition-colors duration-200 font-medium bg-transparent border-none text-primary-foreground cursor-pointer",
                    "hover:text-primary-foreground/80 focus:text-primary-foreground/80 focus:outline-none"
                  )}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1 transition-colors duration-200 font-medium",
                    "hover:text-primary-foreground/80 focus:text-primary-foreground/80 focus:outline-none"
                  )}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className={cn(
              "md:hidden p-2 rounded-md transition-colors",
              "hover:bg-primary/80 focus:bg-primary/80 focus:outline-none"
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={cn("md:hidden bg-primary/90 py-4 border-t border-border/10")}>
            {navItems.map((item) => (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 transition-colors duration-200 rounded-md mx-2 w-full text-left bg-transparent border-none text-primary-foreground cursor-pointer",
                    "hover:bg-primary/70 focus:bg-primary/70 focus:outline-none"
                  )}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 transition-colors duration-200 rounded-md mx-2",
                    "hover:bg-primary/70 focus:bg-primary/70 focus:outline-none"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
