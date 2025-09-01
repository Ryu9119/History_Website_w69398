import React from 'react';
import { cn } from '../lib/utils';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronDown, SortAsc } from 'lucide-react';
import { isFeatureEnabled } from '../lib/feature-flags';

interface SortOption {
  value: string;
  label: string;
}

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOptions: SortOption[];
  className?: string;
}

const ProductSort: React.FC<ProductSortProps> = ({
  sortBy,
  onSortChange,
  sortOptions,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Filter out rating sort if bonus features disabled
  const filteredSortOptions = isFeatureEnabled('ENABLE_RATING_SORT') 
    ? sortOptions 
    : sortOptions.filter(option => option.value !== 'rating');

  const currentSort = filteredSortOptions.find(option => option.value === sortBy);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (sortValue: string) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  // Don't render if sorting is disabled
  if (!isFeatureEnabled('ENABLE_SORTING')) {
    return null;
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Label className="block text-sm font-medium text-foreground mb-2">
        Sắp xếp theo
      </Label>
      
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between bg-background border-border text-foreground",
          "hover:bg-muted focus:bg-muted",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "focus:ring-offset-background"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center space-x-2">
          <SortAsc className="w-4 h-4" />
          <span>{currentSort?.label || 'Chọn sắp xếp'}</span>
        </div>
        <ChevronDown 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </Button>

      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-1 z-10",
          "bg-background border border-border rounded-md shadow-lg",
          "max-h-60 overflow-auto"
        )}>
          {filteredSortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm transition-colors",
                "hover:bg-muted focus:bg-muted",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
                sortBy === option.value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSort;
