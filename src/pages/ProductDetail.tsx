import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductByIdQuery } from '../hooks/useProductsQuery';
import { cn } from '../lib/utils';
import { mockProducts } from '../lib/mock-data';
import { type Product } from '../lib/mock-data';
import ProductCard from '../components/ProductCard';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);
  const isInvalidId = Number.isNaN(id);

  const { data, isLoading, error, refetch } = useProductByIdQuery(Number.isNaN(id) ? undefined : id);
  const product = data?.product ?? null;

  const images = useMemo(() => {
    if (!product) return [] as { src: string; alt: string }[];
    // Mock gallery: use main image + 3 variants
    const baseAlt = `Hình ảnh sản phẩm: ${product.name}`;
    return [
      { src: product.image, alt: baseAlt },
      { src: product.image, alt: baseAlt + ' - góc 1' },
      { src: product.image, alt: baseAlt + ' - góc 2' },
      { src: product.image, alt: baseAlt + ' - góc 3' },
    ];
  }, [product]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onSelect = (index: number) => setActiveIndex(index);

  const related = useMemo(() => {
    if (!product) return [] as Product[];
    return mockProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (isInvalidId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <h1 className="text-xl font-semibold text-card-foreground">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mt-2">ID không hợp lệ.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-md p-4 h-80 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-muted rounded w-full animate-pulse" />
            <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <h1 className="text-xl font-semibold text-card-foreground">Đã xảy ra lỗi</h1>
          <p className="text-muted-foreground mt-2">Đã xảy ra lỗi khi tải sản phẩm.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <h1 className="text-xl font-semibold text-card-foreground">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mt-2">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <section aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="sr-only">Thư viện hình ảnh</h2>
          <div className="bg-card border border-border rounded-md p-3">
            <div className="aspect-square bg-muted rounded flex items-center justify-center overflow-hidden">
              {/* Using placeholder since no real images available */}
              <img
                src={images[activeIndex]?.src}
                alt={images[activeIndex]?.alt}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2" role="listbox" aria-label="Chọn hình ảnh">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  role="option"
                  aria-selected={activeIndex === idx}
                  aria-label={`Hình ${idx + 1}`}
                  onClick={() => onSelect(idx)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelect(idx); }}
                  className={cn(
                    "aspect-square rounded border border-border overflow-hidden",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    activeIndex === idx ? "ring-2 ring-ring" : ""
                  )}
                >
                  <img src={img.src} alt={img.alt} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Info + Specs */}
        <section className="space-y-6">
          <div className="bg-card border border-border rounded-md p-4">
            <h1 className="text-2xl font-semibold text-card-foreground">{product.name}</h1>
            <p className="text-primary text-xl font-bold mt-2">{formatPrice(product.price)}</p>
            <p className="text-muted-foreground mt-3">{product.description}</p>
          </div>

          <div className="bg-card border border-border rounded-md p-4">
            <h2 className="text-lg font-semibold text-card-foreground mb-3">Thông số</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Danh mục</dt>
                <dd className="text-sm text-card-foreground">{product.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Mã sản phẩm</dt>
                <dd className="text-sm text-card-foreground">#{product.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Ngày tạo</dt>
                <dd className="text-sm text-card-foreground">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Đánh giá</dt>
                <dd className="text-sm text-card-foreground">{product.rating}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      {/* Related - same category, max 4 (simple rule, no new endpoints) */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
