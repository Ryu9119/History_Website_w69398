import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/mock-blog';
import { Calendar, Tag } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPost[];
  className?: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  posts, 
  className = "" 
}) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Bài viết liên quan
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={post.coverUrl || '/images/placeholder-cover.svg'}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-cover.svg'; }}
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {post.category}
                </span>
              </div>
              
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                <Link 
                  to={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
