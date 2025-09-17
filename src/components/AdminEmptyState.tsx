import { Package } from 'lucide-react';

const AdminEmptyState = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-muted rounded-full">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Chưa có dữ liệu
          </h3>
          <p className="text-muted-foreground max-w-md">
            Hiện tại chưa có sản phẩm nào trong hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminEmptyState;

