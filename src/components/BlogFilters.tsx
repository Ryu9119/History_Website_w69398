import React from 'react';
import { blogCategories } from '@/lib/mock-blog';
import { Button } from '@/components/ui/button';

interface BlogFiltersProps {
  selectedCategory: string;
  onChangeCategory: (category: string) => void;
  onClear: () => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({ selectedCategory, onChangeCategory, onClear }) => {
  return (
    <div className="w-full bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Danh mục
          </label>
          <select
            id="category"
            className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            value={selectedCategory}
            onChange={(e) => onChangeCategory(e.target.value)}
            aria-label="Lọc theo danh mục"
          >
            {blogCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:w-auto">
          <Button type="button" variant="outline" className="w-full" onClick={onClear}>
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
};


