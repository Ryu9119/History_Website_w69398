import React from 'react';
import { cn } from '../lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Đã xảy ra lỗi khi tải dữ liệu", 
  onRetry, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      "bg-card border border-border rounded-lg",
      className
    )}>
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-card-foreground mb-2">
        Đã xảy ra lỗi
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Thử lại</span>
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
