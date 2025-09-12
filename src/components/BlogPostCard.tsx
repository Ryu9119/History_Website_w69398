import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/mock-blog';
import { cn } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, className }) => {
  const { slug, title, excerpt, category, coverUrl } = post;
  return (
    <article
      className={cn(
        'bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full',
        className
      )}
    >
      <Link to={`/blog/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
        <div className="w-full h-40 bg-muted overflow-hidden">
          <img
            src={coverUrl || '/images/placeholder-cover.svg'}
            alt={`Ảnh bìa: ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder-cover.svg';
            }}
          />
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">{category}</span>
        <h3 className="text-base font-semibold line-clamp-2">
          <Link to={`/blog/${slug}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        <div className="mt-auto pt-2">
          <Link
            to={`/blog/${slug}`}
            className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
            Đọc tiếp
          </Link>
        </div>
      </div>
    </article>
  );
};


