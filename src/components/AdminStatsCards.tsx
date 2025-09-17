import { Package, FileText, CreditCard, FolderOpen } from 'lucide-react';
import { AdminStats } from '../lib/mock-admin';

interface AdminStatsCardsProps {
  stats: AdminStats;
  isLoading?: boolean;
}

const AdminStatsCards = ({ stats, isLoading }: AdminStatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-8 bg-muted rounded w-12"></div>
              </div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Tổng bài viết',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      title: 'Tổng bộ thẻ',
      value: stats.totalFlashcards,
      icon: CreditCard,
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      title: 'Tổng danh mục',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
