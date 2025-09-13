import React from 'react';
import { BlogContentBlock } from '@/lib/mock-blog';

interface BlogContentRendererProps {
  content: BlogContentBlock[];
  className?: string;
}

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  const renderBlock = (block: BlogContentBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p 
            key={index} 
            className="text-foreground leading-relaxed mb-4 last:mb-0"
          >
            {block.content as string}
          </p>
        );
      
      case 'heading2':
        return (
          <h2 
            key={index} 
            className="text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0"
          >
            {block.content as string}
          </h2>
        );
      
      case 'heading3':
        return (
          <h3 
            key={index} 
            className="text-xl font-semibold text-foreground mt-6 mb-3"
          >
            {block.content as string}
          </h3>
        );
      
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2">
            {(block.content as string[]).map((item, itemIndex) => (
              <li 
                key={itemIndex} 
                className="text-foreground leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        );
      
      default:
        return null;
    }
  };

  // Handle missing or empty content
  if (!content || content.length === 0) {
    return (
      <div className={`prose prose-lg max-w-none ${className}`}>
        <p className="text-muted-foreground italic">
          Nội dung đang được cập nhật...
        </p>
      </div>
    );
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default BlogContentRenderer;

