import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (search: string) => void;
  onFilter: (filters: Record<string, string | number | null>) => void;
  searchPlaceholder?: string;
  filters?: {
    key: string;
    label: string;
    type: 'select' | 'input';
    options?: { value: string | number; label: string }[];
    placeholder?: string;
  }[];
  showSearch?: boolean;
  showFilter?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  searchPlaceholder = 'Tìm kiếm...',
  filters = [],
  showSearch = true,
  showFilter = true
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string | number | null>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string | number | null) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilterValues({});
    setSearchValue('');
    onFilter({});
    onSearch('');
  };

  const hasActiveFilters = Object.values(filterValues).some(value => value !== '' && value !== null && value !== undefined) || searchValue !== '';

  return (
    <div className="bg-background p-4 rounded-lg shadow-sm border border-border mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
              />
            </div>
          </div>
        )}

        {/* Filter Toggle */}
        {showFilter && filters.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Filter size={16} />
              <span>Lọc</span>
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {Object.values(filterValues).filter(v => v !== '' && v !== null && v !== undefined).length + (searchValue ? 1 : 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted/50"
              >
                <X size={16} />
                <span>Xóa</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilter && showFilters && filters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value || null)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                  >
                    <option value="">Tất cả</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder || filter.label}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
