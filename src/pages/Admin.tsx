import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import AdminStatsCards from '../components/AdminStatsCards';
import AdminDataTable from '../components/AdminDataTable';
import AdminErrorState from '../components/AdminErrorState';
import AdminEmptyState from '../components/AdminEmptyState';
import { useAdminStats, useAdminProducts } from '../hooks/useAdminData';

const Admin = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useAdminStats();
  
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useAdminProducts();

  // Focus management and screen reader announcements
  useEffect(() => {
    if (stats && products && !statsLoading && !productsLoading) {
      // Focus main content for screen readers
      setTimeout(() => {
        mainContentRef.current?.focus();
      }, 100);
      
      // Announce loading completion
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = 'Đã tải xong dữ liệu admin';
      }
    }
  }, [stats, products, statsLoading, productsLoading]);

  // Announce loading state
  useEffect(() => {
    if (statsLoading || productsLoading) {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = 'Đang tải dữ liệu admin...';
      }
    }
  }, [statsLoading, productsLoading]);

  const handleRetry = () => {
    // Clear error params in dev mode
    if (import.meta.env.DEV && window.location.search.includes('error=1')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
    
    refetchStats();
    refetchProducts();
    
    // Announce retry
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = 'Đang thử lại tải dữ liệu...';
    }
  };

  const hasError = statsError || productsError;
  const isLoading = statsLoading || productsLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Main content focus target */}
        <div
          ref={mainContentRef}
          tabIndex={-1}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-background focus:border focus:border-border focus:px-2 focus:py-1 focus:rounded focus:z-50"
        >
          <h1>Admin Dashboard</h1>
        </div>
        
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi dữ liệu hệ thống
          </p>
        </div>

        {/* Error state */}
        {hasError && (
          <AdminErrorState 
            onRetry={handleRetry}
            isLoading={isLoading}
          />
        )}

        {/* Loading or success state */}
        {!hasError && (
          <>
            {/* Stats cards */}
            <AdminStatsCards 
              stats={stats || { totalProducts: 0, totalBlogs: 0, totalFlashcards: 0, totalCategories: 0 }}
              isLoading={statsLoading}
            />

            {/* Data table */}
            {products && products.length === 0 && !productsLoading ? (
              <AdminEmptyState />
            ) : (
              <AdminDataTable 
                products={products || []}
                isLoading={productsLoading}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
