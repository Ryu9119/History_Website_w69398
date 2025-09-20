import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, Play, BookOpen } from 'lucide-react';

interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  cardCount: number;
  estimatedTime: number;
  topics: string[];
}

interface FlashcardSectionProps {
  isHomePage?: boolean;
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ isHomePage = false }) => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const mockDecks: FlashcardDeck[] = React.useMemo(() => [
    {
      id: '1',
      title: 'Thời kỳ dựng nước',
      description: 'Từ Vua Hùng đến An Dương Vương - Khám phá những câu chuyện về thời kỳ đầu dựng nước của dân tộc Việt',
      category: 'Lịch sử cổ đại',
      difficulty: 'Beginner',
      cardCount: 50,
      estimatedTime: 30,
      topics: ['Vua Hùng', 'An Dương Vương', 'Thành Cổ Loa']
    },
    {
      id: '2',
      title: 'Thời kỳ Bắc thuộc',
      description: 'Từ Hai Bà Trưng đến Ngô Quyền - Tìm hiểu về các cuộc khởi nghĩa chống Bắc thuộc',
      category: 'Kháng chiến',
      difficulty: 'Intermediate',
      cardCount: 75,
      estimatedTime: 45,
      topics: ['Hai Bà Trưng', 'Ngô Quyền', 'Bạch Đằng']
    },
    {
      id: '3',
      title: 'Thời kỳ độc lập',
      description: 'Từ Đinh Bộ Lĩnh đến Lê Lợi - Khám phá các triều đại độc lập đầu tiên',
      category: 'Triều đại',
      difficulty: 'Advanced',
      cardCount: 100,
      estimatedTime: 60,
      topics: ['Đinh Bộ Lĩnh', 'Lê Lợi', 'Lam Sơn']
    }
  ], []);

  useEffect(() => {
    const loadDecks = async () => {
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
          throw new Error('Không thể tải danh sách bộ thẻ');
        }
        
        if (shouldEmpty) {
          setDecks([]);
        } else {
          setDecks(isHomePage ? mockDecks.slice(0, 3) : mockDecks);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [isHomePage, mockDecks]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'Dễ';
      case 'Intermediate':
        return 'Trung bình';
      case 'Advanced':
        return 'Khó';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Flashcard lịch sử</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Học lịch sử một cách tương tác và thú vị với bộ thẻ học được thiết kế đặc biệt
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Flashcard lịch sử</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Học lịch sử một cách tương tác và thú vị với bộ thẻ học được thiết kế đặc biệt
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Flashcard lịch sử</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Học lịch sử một cách tương tác và thú vị với bộ thẻ học được thiết kế đặc biệt cho từng chủ đề lịch sử
          </p>
        </div>
        
        {decks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">🎴</div>
            <p className="text-muted-foreground">Chưa có bộ thẻ nào</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {decks.map((deck) => (
                <div 
                  key={deck.id} 
                  className="bg-card border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/flashcards/${deck.id}`)}
                >
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-primary" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        {deck.category}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full ${getDifficultyColor(deck.difficulty)}`}>
                        {getDifficultyText(deck.difficulty)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-card-foreground">{deck.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{deck.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <Brain size={16} />
                        <span>{deck.cardCount} thẻ</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{deck.estimatedTime} phút</span>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full bg-primary text-primary-foreground px-4 py-2 rounded transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/flashcards/${deck.id}`);
                      }}
                    >
                      <Play size={16} />
                      <span>Học ngay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isHomePage && (
              <div className="text-center">
                <button 
                  onClick={() => navigate('/flashcards')}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Xem tất cả flashcard
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FlashcardSection;
