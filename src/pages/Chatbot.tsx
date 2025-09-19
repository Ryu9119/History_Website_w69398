import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Trash2, RotateCcw } from 'lucide-react';
import { mockAssistant, ChatMessage } from '../lib/mock-assistant';

interface ChatbotProps {
  error?: boolean; // For testing error state
}

const Chatbot: React.FC<ChatbotProps> = ({ error = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(error);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldSlow, setShouldSlow] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  // Check for error query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (import.meta.env.DEV && urlParams.get('error') === '1') {
      setHasError(true);
    }
    // DEV-only slow toggle
    if (import.meta.env.DEV && urlParams.get('slow') === '1') {
      setShouldSlow(true);
    } else {
      setShouldSlow(false);
    }
  }, []);

  // Initial skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Scroll to bottom when message count changes
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const behavior = prefersReducedMotion ? 'auto' : 'smooth';
      container.scrollTo({ top: container.scrollHeight, behavior });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const announceToScreenReader = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };

  const handleSendMessage = async (text?: string) => {
    const candidate = (text ?? inputText).trim();
    if (!candidate || isLoading) return;

    const userMessage = candidate;
    if (text === undefined) {
      setInputText('');
    }
    setIsLoading(true);
    setHasError(false);

    // Add user message immediately
    const newUserMessage: ChatMessage = {
      id: generateId(),
      text: userMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setLastUserMessage(userMessage);
    mockAssistant.addMessage(newUserMessage);
    announceToScreenReader('Đã gửi');
    // Return focus to input for continuous typing
    requestAnimationFrame(() => inputRef.current?.focus());

    try {
      // Simulate typing indicator
      announceToScreenReader('Trợ lý đang nhập...');
      
      // Get response from mock assistant
      const response = await mockAssistant.sendMessage(userMessage);
      // Optional extra delay in DEV when ?slow=1
      if (shouldSlow) {
        const extra = 500 + Math.floor(Math.random() * 500); // 500-1000ms
        await new Promise(r => setTimeout(r, extra));
      }
      
      // Add bot response
      const newBotMessage: ChatMessage = {
        id: generateId(),
        text: response.text,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
      mockAssistant.addMessage(newBotMessage);
      announceToScreenReader(`Trợ lý đã trả lời: ${response.text}`);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setHasError(true);
      announceToScreenReader('Đã xảy ra lỗi khi gửi tin nhắn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent as any).isComposing && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetry = async () => {
    if (!lastUserMessage) return;
    
    setHasError(false);
    await handleSendMessage(lastUserMessage);
    // Focus back to input after retry
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // When error appears, move focus to the first actionable control (Retry)
  useEffect(() => {
    if (hasError) {
      requestAnimationFrame(() => retryButtonRef.current?.focus());
    }
  }, [hasError]);

  const handleClearChat = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện? Hành động này không thể hoàn tác.')) {
      setMessages([]);
      setLastUserMessage(null);
      setHasError(false);
      mockAssistant.clearHistory();
      announceToScreenReader('Đã xóa cuộc trò chuyện');
      // Focus back to input after clear
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      announceToScreenReader('Đã sao chép tin nhắn vào clipboard');
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Skeleton state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className={`w-8 h-8 bg-muted rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 bg-muted rounded w-3/4 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                    <div className={`h-4 bg-muted rounded w-1/2 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 bg-muted rounded w-2/3 ml-auto ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                  </div>
                  <div className={`w-8 h-8 bg-muted rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Screen reader announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card border border-border rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Trợ lý Lịch sử</h1>
                  <p className="text-sm text-muted-foreground">Hỏi tôi bất cứ điều gì về lịch sử</p>
                </div>
              </div>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                aria-label="Xóa cuộc trò chuyện"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-4" role="region" aria-label="Khu vực tin nhắn">
            {messages.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Bắt đầu cuộc trò chuyện</h3>
                <p className="text-muted-foreground max-w-sm">
                  Hỏi tôi về bất kỳ thời kỳ, sự kiện hoặc nhân vật lịch sử nào. Tôi ở đây để giúp bạn học hỏi!
                </p>
              </div>
            ) : (
              // Messages list
              <div className="space-y-4" role="list" aria-live="off">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                    role="listitem"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isBot 
                        ? 'bg-muted text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      {message.isBot && (
                        <button
                          onClick={() => handleCopyMessage(message.text)}
                          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Sao chép tin nhắn"
                        >
                          <Copy className="w-3 h-3" />
                          Sao chép
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-muted text-foreground" aria-label="Trợ lý đang nhập…">
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 bg-muted-foreground rounded-full ${prefersReducedMotion ? '' : 'animate-bounce'}`} />
                        <div className={`w-2 h-2 bg-muted-foreground rounded-full ${prefersReducedMotion ? '' : 'animate-bounce'}`} style={{ animationDelay: prefersReducedMotion ? '' : '0.1s' }} />
                        <div className={`w-2 h-2 bg-muted-foreground rounded-full ${prefersReducedMotion ? '' : 'animate-bounce'}`} style={{ animationDelay: prefersReducedMotion ? '' : '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error state */}
          {hasError && (
            <div className="border-t border-border p-4 bg-destructive/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-destructive">
                  <span className="text-sm">Gửi tin nhắn thất bại. Vui lòng thử lại.</span>
                </div>
                <button
                  onClick={handleRetry}
                  ref={retryButtonRef}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
                  aria-label="Thử lại gửi tin nhắn"
                >
                  <RotateCcw className="w-4 h-4" />
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="chat-input" className="sr-only">
                  Nhập tin nhắn của bạn
                </label>
                <textarea
                  ref={inputRef}
                  id="chat-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="Hỏi về lịch sử... (Enter để gửi, Shift+Enter để xuống dòng)"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={1}
                  disabled={isLoading}
                  style={{
                    minHeight: '40px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;