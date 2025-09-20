import React, { useState, useCallback } from 'react';
import { blogCategories } from '@/lib/mock-blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';

interface BlogFiltersProps {
  selectedCategory: string;
  onChangeCategory: (category: string) => void;
  onClear: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({ 
  selectedCategory, 
  onChangeCategory, 
  onClear,
  searchQuery = '',
  onSearchChange
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const handleClearSearch = useCallback(() => {
    setLocalSearchQuery('');
    onSearchChange?.('');
  }, [onSearchChange]);

  const hasActiveFilters = selectedCategory !== 'Tất cả' || localSearchQuery.trim() !== '';

  return (
    <div className="w-full bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={localSearchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 h-11"
          aria-label="Tìm kiếm bài viết"
        />
        {localSearchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Xóa tìm kiếm"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
            Danh mục
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <select
              id="category"
              className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => onChangeCategory(e.target.value)}
              aria-label="Lọc theo danh mục"
            >
              {blogCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={onClear}
              className="flex items-center gap-2"
            >
              <X size={16} />
              <span className="hidden sm:inline">Xóa bộ lọc</span>
              <span className="sm:hidden">Xóa</span>
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Bộ lọc</span>
          </Button>
        </div>
      </div>

      {/* Expanded Filters (for future use) */}
      {isExpanded && (
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sắp xếp theo
              </label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="readTime">Thời gian đọc</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Thời gian đọc
              </label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
                <option value="all">Tất cả</option>
                <option value="short">Ngắn (≤ 5 phút)</option>
                <option value="medium">Trung bình (6-10 phút)</option>
                <option value="long">Dài (&gt; 10 phút)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
          {selectedCategory !== 'Tất cả' && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {selectedCategory}
            </span>
          )}
          {localSearchQuery.trim() && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              "{localSearchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};


