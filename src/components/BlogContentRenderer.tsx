import React from 'react';
import { BlogContentBlock } from '@/lib/mock-blog';
import { cn } from '@/lib/utils';

interface BlogContentRendererProps {
  content: BlogContentBlock[];
  className?: string;
}

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ 
  content, 
  className 
}) => {
  if (!content || content.length === 0) {
    return (
      <div className={cn("text-muted-foreground italic", className)}>
        Nội dung đang được cập nhật...
      </div>
    );
  }

  const renderContentBlock = (block: BlogContentBlock, index: number) => {
    const key = `block-${index}`;

    switch (block.type) {
      case 'paragraph':
        return (
          <p 
            key={key}
            className="text-foreground leading-relaxed mb-6 text-base"
          >
            {block.content as string}
          </p>
        );

      case 'heading2':
        return (
          <h2 
            key={key}
            className="text-2xl font-bold text-foreground mb-4 mt-8 first:mt-0 leading-tight"
          >
            {block.content as string}
          </h2>
        );

      case 'heading3':
        return (
          <h3 
            key={key}
            className="text-xl font-semibold text-foreground mb-3 mt-6 leading-tight"
          >
            {block.content as string}
          </h3>
        );

      case 'list': {
        const listItems = block.content as string[];
        return (
          <ul 
            key={key}
            className="list-disc list-inside space-y-2 mb-6 text-foreground"
          >
            {listItems.map((item, itemIndex) => (
              <li 
                key={`${key}-item-${itemIndex}`}
                className="leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      }

      default:
        // Fallback for unknown block types
        return (
          <div 
            key={key}
            className="text-muted-foreground italic mb-4"
          >
            {typeof block.content === 'string' ? block.content : 'Nội dung không được hỗ trợ'}
          </div>
        );
    }
  };

  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {content.map((block, index) => renderContentBlock(block, index))}
    </div>
  );
};

export default BlogContentRenderer;