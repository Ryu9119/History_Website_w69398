import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdminStatsCards from '../components/AdminStatsCards';
import SearchFilter from '../components/ui/search-filter';
import AdminErrorState from '../components/AdminErrorState';
import AdminEmptyState from '../components/AdminEmptyState';
import { useAdminStats, useAdminProducts } from '../hooks/useAdminData';
import { adminApi } from '../lib/admin-api';
import ProductModal from '../components/admin/ProductModal';
import BlogModal from '../components/admin/BlogModal';
import BannerModal from '../components/admin/BannerModal';
import FlashCardModal from '../components/admin/FlashCardModal';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'blogs' | 'banners' | 'flashcards'>('dashboard');
  const [roleChecked, setRoleChecked] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{
    id: number; name: string; price: number; status: 'active' | 'inactive'
  } | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<{
    id: number; title: string; slug: string; excerpt: string; content: string; status: 'draft' | 'published'
  } | null>(null);
  const [blogs, setBlogs] = useState<Array<{ id: number; title: string; slug: string; status: 'draft' | 'published'; createdAt: string }>>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<Error | null>(null);
  const [banners, setBanners] = useState<Array<{ id: number; title: string; imageUrl: string; active: boolean; createdAt: string }>>([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [bannersError, setBannersError] = useState<Error | null>(null);
  const [flashcards, setFlashcards] = useState<Array<{ id: number; topic: string; description?: string; totalCards: number; createdAt: string }>>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [flashcardsError, setFlashcardsError] = useState<Error | null>(null);
  
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<{ id: number; title: string; imageUrl: string; linkUrl?: string; active: boolean } | null>(null);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<{ id: number; topic: string; description?: string; totalCards: number } | null>(null);
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

  // Role/permission check
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const me = await adminApi.me();
        if (!me || me.role !== 'admin') {
          toast.error('Bạn không có quyền truy cập trang Admin');
          navigate('/');
          return;
        }
      } catch {
        toast.error('Không thể xác thực quyền truy cập');
        navigate('/');
        return;
      } finally {
        if (isMounted) setRoleChecked(true);
      }
    })();
    return () => { isMounted = false; };
  }, [navigate]);

  // Load blogs when tab active
  const fetchBlogs = async () => {
    setBlogsError(null);
    setBlogsLoading(true);
    try {
      const data = await adminApi.listBlogs();
      setBlogs(data.map(b => ({ id: b.id, title: b.title, slug: b.slug, status: b.status, createdAt: b.createdAt })));
    } catch (e) {
      setBlogsError(e as Error);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    if (roleChecked && activeTab === 'blogs') {
      fetchBlogs();
    }
  }, [activeTab, roleChecked, fetchBlogs]);

  const fetchBanners = async () => {
    setBannersError(null);
    setBannersLoading(true);
    try {
      const data = await adminApi.listBanners();
      setBanners(data.map(b => ({ id: b.id, title: b.title, imageUrl: b.imageUrl, active: b.active, createdAt: b.createdAt })));
    } catch (e) {
      setBannersError(e as Error);
    } finally {
      setBannersLoading(false);
    }
  };

  const fetchFlashcards = async () => {
    setFlashcardsError(null);
    setFlashcardsLoading(true);
    try {
      const data = await adminApi.listFlashcards();
      setFlashcards(data.map(f => ({ id: f.id, topic: f.topic, totalCards: f.totalCards, createdAt: f.createdAt })));
    } catch (e) {
      setFlashcardsError(e as Error);
    } finally {
      setFlashcardsLoading(false);
    }
  };

  useEffect(() => {
    if (!roleChecked) return;
    if (activeTab === 'banners') fetchBanners();
    if (activeTab === 'flashcards') fetchFlashcards();
  }, [activeTab, roleChecked, fetchBanners, fetchFlashcards]);

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

  if (!roleChecked) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse h-6 w-40 bg-muted rounded mb-4" />
          <div className="animate-pulse h-4 w-64 bg-muted rounded" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      
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

        {/* Tabs */}
        <div className="mb-6 flex gap-2" role="tablist" aria-label="Admin sections">
          {[
            { key: 'dashboard', label: 'Tổng quan' },
            { key: 'products', label: 'Sản phẩm' },
            { key: 'blogs', label: 'Blog' },
            { key: 'banners', label: 'Banners' },
            { key: 'flashcards', label: 'Flashcards' },
          ].map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === (t.key as typeof activeTab)}
              className={`px-3 py-1.5 rounded border ${activeTab === t.key ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
            >
              {t.label}
            </button>
          ))}
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
            {activeTab === 'dashboard' && (
              <AdminStatsCards 
                stats={stats || { totalProducts: 0, totalBlogs: 0, totalFlashcards: 0, totalCategories: 0 }}
                isLoading={statsLoading}
              />
            )}

            {activeTab === 'products' && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="px-2 py-1 border rounded"
                      onChange={() => {/* stub parity */}}
                    />
                    <select className="px-2 py-1 border rounded" onChange={() => {/* stub parity */}}>
                      <option value="all">Tất cả</option>
                      <option value="active">Đang bán</option>
                      <option value="inactive">Tạm ẩn</option>
                    </select>
                    <button
                      className="px-3 py-1 rounded bg-primary text-primary-foreground"
                      onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    >
                      Thêm sản phẩm
                    </button>
                  </div>
                </div>

                {/* SearchFilter for visual parity - functionality disabled to avoid complexity */}
                <SearchFilter
                  onSearch={() => {}}
                  onFilter={() => {}}
                  searchPlaceholder="Tìm kiếm sản phẩm..."
                  showSearch={false}
                  showFilter={false}
                />

                {products && products.length === 0 && !productsLoading ? (
                  <AdminEmptyState />
                ) : (
                  <>
                    {productsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Đang tải...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Tên sản phẩm
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Giá
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Trạng thái
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Ngày tạo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Hành động
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-background divide-y divide-border">
                            {(products || []).map((product) => (
                              <tr key={product.id} className="hover:bg-muted/30">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                  {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    product.status === 'active'
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex gap-2">
                                    <button
                                      className="text-primary hover:text-primary/80 px-2 py-1 border border-primary/20 rounded hover:bg-primary/10 transition-colors"
                                      onClick={() => { 
                                        setEditingProduct({ 
                                          id: product.id, 
                                          name: product.name, 
                                          price: product.price, 
                                          status: product.status 
                                        }); 
                                        setShowProductModal(true); 
                                      }}
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                      onClick={async () => {
                                        if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
                                        try {
                                          await adminApi.deleteProduct(product.id);
                                          toast.success('Xóa sản phẩm thành công');
                                          await refetchProducts();
                                        } catch {
                                          toast.error('Xóa thất bại');
                                        }
                                      }}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Simple actions list for demo wiring */}
                    {!productsLoading && (products || []).length > 0 && (
                      <div className="mt-4 border rounded">
                        <div className="px-3 py-2 font-medium">Hành động nhanh</div>
                        <ul>
                          {(products || []).slice(0, 5).map(p => (
                            <li key={p.id} className="flex items-center justify-between px-3 py-2 border-t">
                              <div className="truncate mr-2">#{p.id} · {p.name}</div>
                              <div className="flex gap-2">
                                <button
                                  className="px-2 py-1 border rounded"
                                  onClick={() => { setEditingProduct({ id: p.id, name: p.name, price: p.price, status: p.status }); setShowProductModal(true); }}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="px-2 py-1 border rounded text-red-600"
                                  onClick={async () => {
                                    if (!window.confirm(`Xóa sản phẩm "${p.name}"?`)) return;
                                    try {
                                      await adminApi.deleteProduct(p.id);
                                      toast.success('Đã xóa sản phẩm');
                                      await refetchProducts();
                                    } catch (e) {
                                      toast.error(e instanceof Error ? e.message : 'Xóa thất bại');
                                    }
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

              </>
            )}

            {/* Banners */}
            {activeTab === 'banners' && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Quản lý Banners</h2>
                  <button className="px-3 py-1 rounded bg-primary text-primary-foreground" onClick={() => { setEditingBanner(null); setShowBannerModal(true); }}>Thêm banner</button>
                </div>

                {/* SearchFilter for visual parity - functionality disabled to avoid complexity */}
                <SearchFilter
                  onSearch={() => {}}
                  onFilter={() => {}}
                  searchPlaceholder="Tìm kiếm banner..."
                  showSearch={false}
                  showFilter={false}
                />

                {bannersError && (<AdminErrorState onRetry={fetchBanners} isLoading={bannersLoading} />)}
                {!bannersError && (
                  <>
                    {banners.length === 0 && !bannersLoading ? (
                      <AdminEmptyState />
                    ) : (
                      <div className="border rounded">
                        <div className="px-3 py-2 font-medium">Danh sách banners</div>
                        {bannersLoading && <div className="p-3 text-sm text-muted-foreground">Đang tải…</div>}
                        {!bannersLoading && (
                          <ul>
                            {banners.map(b => (
                              <li key={b.id} className="flex items-center justify-between px-3 py-2 border-t">
                                <div className="truncate mr-2">#{b.id} · {b.title} {b.active ? '' : <span className="text-xs text-muted-foreground">(ẩn)</span>}</div>
                                <div className="flex gap-2">
                                  <button className="px-2 py-1 border rounded" onClick={() => { setEditingBanner({ id: b.id, title: b.title, imageUrl: b.imageUrl, active: b.active }); setShowBannerModal(true); }}>Sửa</button>
                                  <button className="px-2 py-1 border rounded text-red-600" onClick={async () => {
                                    if (!window.confirm(`Xóa banner "${b.title}"?`)) return;
                                    try {
                                      await adminApi.deleteBanner(b.id);
                                      toast.success('Đã xóa banner');
                                      await fetchBanners();
                                    } catch (e) {
                                      toast.error(e instanceof Error ? e.message : 'Xóa thất bại');
                                    }
                                  }}>Xóa</button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}

                <BannerModal
                  isOpen={showBannerModal}
                  onClose={() => setShowBannerModal(false)}
                  banner={editingBanner || undefined}
                  onSave={async (data) => {
                    try {
                      if (editingBanner) {
                        await adminApi.updateBanner(editingBanner.id, { title: data.title, imageUrl: data.imageUrl, linkUrl: data.linkUrl, active: data.active });
                        toast.success('Cập nhật banner thành công');
                      } else {
                        await adminApi.createBanner({ title: data.title, imageUrl: data.imageUrl, linkUrl: data.linkUrl, active: data.active });
                        toast.success('Thêm banner thành công');
                      }
                      setShowBannerModal(false);
                      setEditingBanner(null);
                      await fetchBanners();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : 'Lưu thất bại');
                      throw e;
                    }
                  }}
                />
              </>
            )}

            {/* Flashcards */}
            {activeTab === 'flashcards' && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Quản lý Flashcards</h2>
                  <button className="px-3 py-1 rounded bg-primary text-primary-foreground" onClick={() => { setEditingFlashcard(null); setShowFlashcardModal(true); }}>Thêm bộ thẻ</button>
                </div>

                {/* SearchFilter for visual parity - functionality disabled to avoid complexity */}
                <SearchFilter
                  onSearch={() => {}}
                  onFilter={() => {}}
                  searchPlaceholder="Tìm kiếm bộ thẻ..."
                  showSearch={false}
                  showFilter={false}
                />

                {flashcardsError && (<AdminErrorState onRetry={fetchFlashcards} isLoading={flashcardsLoading} />)}
                {!flashcardsError && (
                  <>
                    {flashcards.length === 0 && !flashcardsLoading ? (
                      <AdminEmptyState />
                    ) : (
                      <div className="border rounded">
                        <div className="px-3 py-2 font-medium">Danh sách bộ thẻ</div>
                        {flashcardsLoading && <div className="p-3 text-sm text-muted-foreground">Đang tải…</div>}
                        {!flashcardsLoading && (
                          <ul>
                            {flashcards.map(f => (
                              <li key={f.id} className="flex items-center justify-between px-3 py-2 border-t">
                                <div className="truncate mr-2">#{f.id} · {f.topic} <span className="text-xs text-muted-foreground">({f.totalCards} thẻ)</span></div>
                                <div className="flex gap-2">
                                  <button className="px-2 py-1 border rounded" onClick={() => { setEditingFlashcard({ id: f.id, topic: f.topic, totalCards: f.totalCards }); setShowFlashcardModal(true); }}>Sửa</button>
                                  <button className="px-2 py-1 border rounded text-red-600" onClick={async () => {
                                    if (!window.confirm(`Xóa bộ thẻ "${f.topic}"?`)) return;
                                    try {
                                      await adminApi.deleteFlashcard(f.id);
                                      toast.success('Đã xóa bộ thẻ');
                                      await fetchFlashcards();
                                    } catch (e) {
                                      toast.error(e instanceof Error ? e.message : 'Xóa thất bại');
                                    }
                                  }}>Xóa</button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}

                <FlashCardModal
                  isOpen={showFlashcardModal}
                  onClose={() => setShowFlashcardModal(false)}
                  flashCard={editingFlashcard || undefined}
                  onSave={async (data) => {
                    try {
                      if (editingFlashcard) {
                        await adminApi.updateFlashcard(editingFlashcard.id, { topic: data.topic, description: data.description, totalCards: data.totalCards });
                        toast.success('Cập nhật bộ thẻ thành công');
                      } else {
                        await adminApi.createFlashcard({ topic: data.topic, description: data.description, totalCards: data.totalCards });
                        toast.success('Thêm bộ thẻ thành công');
                      }
                      setShowFlashcardModal(false);
                      setEditingFlashcard(null);
                      await fetchFlashcards();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : 'Lưu thất bại');
                      throw e;
                    }
                  }}
                />
              </>
            )}

            <ProductModal
              isOpen={showProductModal}
              onClose={() => setShowProductModal(false)}
              product={editingProduct}
              onSave={async (data) => {
                try {
                  if (editingProduct) {
                    await adminApi.updateProduct(editingProduct.id, { name: data.name, price: data.price, status: data.status });
                    toast.success('Cập nhật sản phẩm thành công');
                  } else {
                    await adminApi.createProduct({ name: data.name, price: data.price, status: data.status, categoryId: null });
                    toast.success('Thêm sản phẩm thành công');
                  }
                  setShowProductModal(false);
                  setEditingProduct(null);
                  await refetchProducts();
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Lưu thất bại');
                  throw e;
                }
              }}
            />

            {activeTab === 'blogs' && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Quản lý Blog</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded border"
                      onClick={() => {
                        // Retry clear dev error param
                        if (import.meta.env.DEV && window.location.search.includes('error=1')) {
                          const url = new URL(window.location.href);
                          url.searchParams.delete('error');
                          window.history.replaceState({}, '', url.toString());
                        }
                        fetchBlogs();
                      }}
                    >
                      Tải lại
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-primary text-primary-foreground"
                      onClick={() => { setEditingBlog(null); setShowBlogModal(true); }}
                    >
                      Thêm bài viết
                    </button>
                  </div>
                </div>

                {blogsError && (
                  <AdminErrorState onRetry={fetchBlogs} isLoading={blogsLoading} />
                )}

                {!blogsError && (
                  <>
                    {blogs.length === 0 && !blogsLoading ? (
                      <AdminEmptyState />
                    ) : (
                      <div className="border rounded">
                        <div className="px-3 py-2 font-medium">Danh sách bài viết</div>
                        {blogsLoading && <div className="p-3 text-sm text-muted-foreground">Đang tải…</div>}
                        {!blogsLoading && (
                          <ul>
                            {blogs.map(b => (
                              <li key={b.id} className="flex items-center justify-between px-3 py-2 border-t">
                                <div className="truncate mr-2">#{b.id} · {b.title} <span className="text-xs text-muted-foreground">({b.status})</span></div>
                                <div className="flex gap-2">
                                  <button className="px-2 py-1 border rounded" onClick={() => { setEditingBlog({ id: b.id, title: b.title, slug: b.slug, excerpt: '', content: '', status: b.status }); setShowBlogModal(true); }}>Sửa</button>
                                  <button className="px-2 py-1 border rounded text-red-600" onClick={async () => {
                                    if (!window.confirm(`Xóa bài viết "${b.title}"?`)) return;
                                    try {
                                      await adminApi.deleteBlog(b.id);
                                      toast.success('Đã xóa bài viết');
                                      await fetchBlogs();
                                    } catch (e) {
                                      toast.error(e instanceof Error ? e.message : 'Xóa thất bại');
                                    }
                                  }}>Xóa</button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}

                <BlogModal
                  isOpen={showBlogModal}
                  onClose={() => setShowBlogModal(false)}
                  blog={editingBlog}
                  onSave={async (data) => {
                    try {
                      if (editingBlog) {
                        await adminApi.updateBlog(editingBlog.id, { title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content, status: data.status });
                        toast.success('Cập nhật bài viết thành công');
                      } else {
                        await adminApi.createBlog({ title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content, status: data.status, categoryId: null });
                        toast.success('Thêm bài viết thành công');
                      }
                      setShowBlogModal(false);
                      setEditingBlog(null);
                      await fetchBlogs();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : 'Lưu thất bại');
                      throw e;
                    }
                  }}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
