import { AdminProduct } from '../lib/mock-admin';

interface AdminDataTableProps {
  products: AdminProduct[];
  isLoading?: boolean;
}

const AdminDataTable = ({ products, isLoading }: AdminDataTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === 'active';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {isActive ? 'Hoạt động' : 'Không hoạt động'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Danh sách sản phẩm
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Tên sản phẩm
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Danh mục
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Giá
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Đánh giá
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Ngày tạo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-border animate-pulse">
                    <td className="py-3 px-4">
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 bg-muted rounded-full w-20"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">Chưa có dữ liệu</p>
          <p className="text-sm">Không có sản phẩm nào để hiển thị.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Danh sách sản phẩm
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <caption className="sr-only">Bảng danh sách sản phẩm</caption>
            <thead>
              <tr className="border-b border-border">
                <th 
                  scope="col" 
                  className="text-left py-3 px-4 font-medium text-muted-foreground"
                >
                  Tên sản phẩm
                </th>
                <th 
                  scope="col" 
                  className="text-left py-3 px-4 font-medium text-muted-foreground"
                >
                  Danh mục
                </th>
                <th 
                  scope="col" 
                  className="text-left py-3 px-4 font-medium text-muted-foreground"
                >
                  Giá
                </th>
                <th 
                  scope="col" 
                  className="text-left py-3 px-4 font-medium text-muted-foreground"
                >
                  Đánh giá
                </th>
                <th 
                  scope="col" 
                  className="text-left py-3 px-4 font-medium text-muted-foreground"
                >
                  Ngày tạo
                </th>
                <th 
                  scope="col" 
                  className="text-left py-3 px-4 font-medium text-muted-foreground"
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">
                      {product.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-foreground font-medium">
                        {product.rating}
                      </span>
                      <span className="text-muted-foreground ml-1">★</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(product.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDataTable;
