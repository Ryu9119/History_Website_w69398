import React from 'react';
import { cn } from '../lib/utils';
import { Search, Package } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  type: 'no-products' | 'no-results';
  onClearFilters?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  onClearFilters, 
  className 
}) => {
  if (type === 'no-products') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        "bg-card border border-border rounded-lg",
        className
      )}>
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          Chưa có sản phẩm nào
        </h3>
        <p className="text-muted-foreground max-w-md">
          Hiện tại chúng tôi chưa có sản phẩm nào trong danh mục này. 
          Vui lòng quay lại sau hoặc liên hệ với chúng tôi để biết thêm thông tin.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      "bg-card border border-border rounded-lg",
      className
    )}>
      <Search className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-card-foreground mb-2">
        Không tìm thấy sản phẩm
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Không có sản phẩm nào phù hợp với bộ lọc của bạn. 
        Hãy thử điều chỉnh các tiêu chí tìm kiếm hoặc xóa bộ lọc để xem tất cả sản phẩm.
      </p>
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
