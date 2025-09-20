import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/mock-blog';
import { cn } from '@/lib/utils';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, className }) => {
  const { slug, title, excerpt, category, coverUrl, author, readTime, createdAt } = post;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article
      className={cn(
        'bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full',
        'hover:shadow-lg transition-all duration-300 hover:border-primary/20',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
    >
      <Link 
        to={`/blog/${slug}`} 
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        aria-label={`Đọc bài viết: ${title}`}
      >
        <div className="w-full h-48 bg-muted overflow-hidden relative group">
          <img
            src={coverUrl || '/images/placeholder-cover.svg'}
            alt={`Ảnh bìa: ${title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder-cover.svg';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col gap-3">
        <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
          <Link 
            to={`/blog/${slug}`} 
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background focus-visible:rounded-sm"
          >
            {title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground line-clamp-3 leading-relaxed flex-1">
          {excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{readTime} phút</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            to={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
            <span>Đọc tiếp</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};


