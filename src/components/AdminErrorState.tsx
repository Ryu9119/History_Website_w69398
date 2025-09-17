import { AlertCircle, RefreshCw } from 'lucide-react';

interface AdminErrorStateProps {
  onRetry: () => void;
  isLoading?: boolean;
}

const AdminErrorState = ({ onRetry, isLoading }: AdminErrorStateProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-destructive/10 rounded-full">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Không thể tải dữ liệu
          </h3>
          <p className="text-muted-foreground max-w-md">
            Đã xảy ra lỗi khi tải dữ liệu admin. Vui lòng thử lại sau.
          </p>
        </div>
        <button
          onClick={onRetry}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Thử lại tải dữ liệu"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminErrorState;
