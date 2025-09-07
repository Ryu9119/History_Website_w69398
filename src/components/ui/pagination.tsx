import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Trước
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="ml-3"
        >
          Sau
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="font-medium text-foreground">{startItem}</span> đến{' '}
            <span className="font-medium text-foreground">{endItem}</span> trong tổng số{' '}
            <span className="font-medium text-foreground">{totalItems}</span> kết quả
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="rounded-l-md rounded-r-none"
            >
              <span className="sr-only">Trước</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                variant={page === currentPage ? "primary" : "outline"}
                size="sm"
                className={`rounded-none ${
                  page === '...'
                    ? 'cursor-default'
                    : ''
                }`}
              >
                {page}
              </Button>
            ))}
            
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="rounded-r-md rounded-l-none"
            >
              <span className="sr-only">Sau</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
