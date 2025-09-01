import Header from '../components/Header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Products = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <form className="mb-6 max-w-xl space-y-2" noValidate>
          <div>
            <Label htmlFor="product-search">Tìm kiếm sản phẩm</Label>
            <div className="mt-1 flex gap-2">
              <Input 
                id="product-search" 
                name="q" 
                placeholder="Nhập từ khóa..." 
                className="w-full"
                aria-invalid={false}
                aria-describedby="product-search-error"
              />
              <Button type="submit" variant="primary">Tìm</Button>
            </div>
            <p id="product-search-error" className="text-sm text-destructive hidden">
              Vui lòng nhập từ khóa tìm kiếm
            </p>
          </div>
        </form>
        <p className="text-muted-foreground">This is a skeleton page for the products section.</p>
      </div>
    </div>
  );
};

export default Products;
