import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: number;
  createdAt: string;
  image?: string;
}

interface BlogSectionProps {
  isHomePage?: boolean;
}

const BlogSection: React.FC<BlogSectionProps> = ({ isHomePage = false }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const mockPosts: BlogPost[] = React.useMemo(() => [
    {
      id: '1',
      title: 'Cuộc khởi nghĩa Hai Bà Trưng',
      excerpt: 'Tìm hiểu về cuộc khởi nghĩa chống Bắc thuộc đầu tiên trong lịch sử Việt Nam',
      author: 'Nguyễn Văn A',
      category: 'Lịch sử cổ đại',
      readTime: 5,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Chiến thắng Bạch Đằng',
      excerpt: 'Khám phá chiến thuật thông minh của Ngô Quyền trong trận Bạch Đằng',
      author: 'Trần Thị B',
      category: 'Chiến tranh',
      readTime: 7,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Văn hóa Đông Sơn',
      excerpt: 'Tìm hiểu về nền văn hóa đồ đồng nổi tiếng của người Việt cổ',
      author: 'Lê Văn C',
      category: 'Văn hóa',
      readTime: 6,
      createdAt: '2024-01-05'
    }
  ], []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      
      // Check for dev toggles
      const urlParams = new URLSearchParams(window.location.search);
      const shouldError = import.meta.env.DEV && urlParams.get('error') === '1';
      const shouldEmpty = import.meta.env.DEV && urlParams.get('empty') === '1';
      
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        if (shouldError) {
          throw new Error('Không thể tải danh sách bài viết');
        }
        
        if (shouldEmpty) {
          setPosts([]);
        } else {
          setPosts(isHomePage ? mockPosts.slice(0, 3) : mockPosts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [isHomePage, mockPosts]);

  if (loading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Blog lịch sử</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá những câu chuyện lịch sử thú vị và những bài viết chuyên sâu
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                    <div className="h-8 bg-muted animate-pulse rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Blog lịch sử</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá những câu chuyện lịch sử thú vị và những bài viết chuyên sâu
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="text-destructive text-6xl mb-4">⚠️</div>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Blog lịch sử</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá những câu chuyện lịch sử thú vị và những bài viết chuyên sâu về lịch sử Việt Nam
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📝</div>
            <p className="text-muted-foreground">Chưa có bài viết nào</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="h-48 bg-muted flex items-center justify-center">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={400}
                        height={192}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <BookOpen className="w-20 h-20 text-primary" />
                    )}
                    <BookOpen className="w-20 h-20 text-primary hidden" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{post.readTime} phút</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-card-foreground line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    
                    <button 
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${post.id}`);
                      }}
                    >
                      <span>Đọc tiếp</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {isHomePage && (
              <div className="text-center">
                <button 
                  onClick={() => navigate('/blog')}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
