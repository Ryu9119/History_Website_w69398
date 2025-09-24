import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Product as MockProduct } from '../lib/mock-data';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  icon?: string;
}

interface ProductSectionProps {
  isHomePage?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ isHomePage = false }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const mockProducts: Product[] = React.useMemo(() => [
    {
      id: '1',
      name: 'Board Game Lịch Sử Việt Nam',
      description: 'Trò chơi board game tương tác giúp học lịch sử một cách thú vị',
      price: '299.000',
      category: 'Board Game',
      icon: 'gamepad'
    },
    {
      id: '2',
      name: 'Flashcard Lịch Sử Cổ Đại',
      description: 'Bộ thẻ học lịch sử với hình ảnh minh họa sinh động',
      price: '199.000',
      category: 'Flashcard',
      icon: 'book'
    },
    {
      id: '3',
      name: 'Áo Thun Lịch Sử',
      description: 'Áo thun in hình các nhân vật lịch sử nổi tiếng',
      price: '150.000',
      category: 'Merchandise',
      icon: 'shirt'
    }
  ], []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      // Check for dev toggles
      const urlParams = new URLSearchParams(window.location.search);
      const shouldError = import.meta.env.DEV && urlParams.get('error') === '1';
      const shouldEmpty = import.meta.env.DEV && urlParams.get('empty') === '1';
      
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        if (shouldError) {
          throw new Error('Không thể tải danh sách sản phẩm');
        }
        
        if (shouldEmpty) {
          setProducts([]);
        } else {
          setProducts(isHomePage ? mockProducts.slice(0, 3) : mockProducts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [isHomePage, mockProducts]);


  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá các sản phẩm giáo dục lịch sử chất lượng cao
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted animate-pulse rounded w-20"></div>
                    <div className="h-8 bg-muted animate-pulse rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá các sản phẩm giáo dục lịch sử chất lượng cao
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="text-destructive text-6xl mb-4">⚠️</div>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Sản phẩm nổi bật</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá các sản phẩm giáo dục lịch sử chất lượng cao, được thiết kế để giúp việc học tập trở nên thú vị và hiệu quả
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📦</div>
            <p className="text-muted-foreground">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {products.map((product) => {
                // Convert ProductSection Product to MockProduct format
                const mockProduct: MockProduct = {
                  id: parseInt(product.id),
                  name: product.name,
                  description: product.description,
                  price: parseInt(product.price.replace(/\./g, '')),
                  category: product.category,
                  image: product.image || '/images/placeholder-product.svg',
                  createdAt: new Date().toISOString(),
                  rating: 4.5
                };
                return <ProductCard key={product.id} product={mockProduct} />;
              })}
            </div>

            {isHomePage && (
              <div className="text-center">
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
