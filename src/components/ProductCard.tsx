import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Package, Shirt, BookOpen } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

const getProductIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'board game':
    case 'game':
      return Gamepad2;
    case 'sách':
    case 'book':
    case 'flashcard':
      return BookOpen;
    case 'merchandise':
    case 'áo':
    case 'shirt':
      return Shirt;
    default:
      return Package;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const navigate = useNavigate();
  const IconComponent = getProductIcon(product.category);

  const handleClick = React.useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  const handleButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  return (
    <div 
      className="bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-48 bg-muted flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <IconComponent className="w-20 h-20 text-primary hidden" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{product.name}</h3>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={handleButtonClick}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
});