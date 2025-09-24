import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, UserCheck, Target, Route } from 'lucide-react';
import { authApi } from '../lib/auth-api';

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Helper để lấy hoặc tạo thread id và lưu vào localStorage
const getOrCreateThreadId = () => {
  let threadId = localStorage.getItem('chatbot_thread_id');
  if (!threadId) {
    threadId = 'thread_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatbot_thread_id', threadId);
  }
  return threadId;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [threadId] = useState(() => getOrCreateThreadId());
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll within chat container, not the entire page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Get user ID from authentication on component mount
  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      setUserId(currentUser.id.toString());
    }
  }, []);

  // Load chat history when userId is available
  useEffect(() => {
    if (userId) {
      loadChatHistory();
    }
  }, [userId]);

  const loadChatHistory = async () => {
    if (!userId) return;
    
    try {
      // Initialize with welcome message
      setMessages([
        {
          id: 1,
          text: 'Xin chào! Tôi là AI Assistant của Thiên Sử Ký. Tôi có thể giúp bạn tìm hiểu về lịch sử Việt Nam. Bạn muốn biết điều gì?',
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([
        {
          id: 1,
          text: 'Xin chào! Tôi là AI Assistant của Thiên Sử Ký. Tôi có thể giúp bạn tìm hiểu về lịch sử Việt Nam. Bạn muốn biết điều gì?',
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  };

  useEffect(() => {
    // Only scroll when there's a new message (when length changes)
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  // Handle prompt button clicks
  const handlePromptButton = (type: string) => {
    let promptMessage = '';
    switch (type) {
      case 'explore':
        promptMessage = 'Tôi muốn khám phá các chủ đề lịch sử Việt Nam thú vị. Bạn có thể giới thiệu cho tôi một số chủ đề nổi bật không?';
        break;
      case 'personal':
        promptMessage = 'Tôi muốn tìm hiểu về các nhân vật lịch sử nổi tiếng của Việt Nam. Bạn có thể kể cho tôi về một số nhân vật quan trọng không?';
        break;
      case 'challenge':
        promptMessage = 'Tôi muốn thử thách kiến thức lịch sử của mình. Bạn có thể đưa ra một số câu hỏi thú vị về lịch sử Việt Nam không?';
        break;
      case 'roadmap':
        promptMessage = 'Tôi muốn học lịch sử Việt Nam một cách có hệ thống. Bạn có thể đề xuất một lộ trình học tập cho tôi không?';
        break;
      default:
        return;
    }
    sendMessage(promptMessage);
  };

  const sendMessageToAPI = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Mock response based on message content
    if (message.toLowerCase().includes('khám phá')) {
      return 'Dưới đây là một số chủ đề lịch sử Việt Nam thú vị:\n\n1. **Các triều đại phong kiến**: Từ nhà Đinh đến nhà Nguyễn\n2. **Kháng chiến chống thực dân Pháp**: Cuộc đấu tranh giành độc lập\n3. **Chiến tranh Việt Nam**: Cuộc kháng chiến chống Mỹ\n4. **Văn hóa truyền thống**: Phong tục, tập quán Việt Nam\n\nBạn muốn tìm hiểu sâu về chủ đề nào?';
    } else if (message.toLowerCase().includes('nhân vật')) {
      return 'Một số nhân vật lịch sử nổi tiếng của Việt Nam:\n\n• **Hùng Vương**: Vua đầu tiên của Việt Nam\n• **Lý Thái Tổ**: Người sáng lập triều Lý\n• **Trần Hưng Đạo**: Danh tướng chống quân Mông Cổ\n• **Hồ Chí Minh**: Lãnh tụ vĩ đại của dân tộc\n\nBạn muốn biết thêm về ai?';
    } else if (message.toLowerCase().includes('thử thách')) {
      return 'Đây là một số câu hỏi thú vị về lịch sử Việt Nam:\n\n1. Trận Bạch Đằng năm 1288 do ai chỉ huy?\n2. Kinh đô đầu tiên của Việt Nam là gì?\n3. Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?\n\nHãy thử trả lời và tôi sẽ giải thích chi tiết!';
    } else if (message.toLowerCase().includes('lộ trình')) {
      return 'Lộ trình học lịch sử Việt Nam có hệ thống:\n\n**Giai đoạn 1**: Lịch sử cổ đại (Hùng Vương - Hai Bà Trưng)\n**Giai đoạn 2**: Các triều đại phong kiến (Đinh - Nguyễn)\n**Giai đoạn 3**: Thời kỳ Pháp thuộc và kháng chiến\n**Giai đoạn 4**: Lịch sử hiện đại (1945 - nay)\n\nBạn muốn bắt đầu từ giai đoạn nào?';
    } else {
      return `Tôi hiểu bạn quan tâm về: "${message}"\n\nĐây là một chủ đề rất thú vị trong lịch sử Việt Nam. Tôi có thể giúp bạn tìm hiểu sâu hơn về vấn đề này. Bạn có câu hỏi cụ thể nào không?`;
    }
  };

  const sendMessage = async (message?: string) => {
    const messageToSend = message || inputText.trim();
    if (!messageToSend || isLoading) return;

    setInputText('');
    setLastUserMessage(messageToSend);

    // Add user message immediately
    const newUserMessage = {
      id: messages.length + 1,
      text: messageToSend,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, newUserMessage];
      setTimeout(scrollToBottom, 100);
      return newMessages;
    });

    setIsLoading(true);

    try {
      // Send message to API and get response
      const botResponseText = await sendMessageToAPI(messageToSend);
      
      // Add bot response
      const newBotMessage = {
        id: messages.length + 2,
        text: botResponseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, newBotMessage];
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-red-900 text-white py-16 pt-24 flex items-center justify-center">
        <div className="text-center px-4 w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Chatbot AI</h1>
          <p className="text-xl text-red-100 leading-relaxed max-w-2xl mx-auto">
            Trò chuyện với AI để tìm hiểu về lịch sử Việt Nam
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {message.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {message.text.split('\n\n').map((para, idx) => (
                      <p key={idx} style={{ marginBottom: 8 }}>
                        {para.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i !== para.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600">
                    <Bot size={16} />
                  </div>
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              {/* Prompt Buttons */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn chế độ tương tác:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => handlePromptButton('explore')}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <BookOpen size={16} />
                    Khám Phá Chủ Đề
                  </button>
                  <button
                    onClick={() => handlePromptButton('personal')}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 disabled:bg-gray-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UserCheck size={16} />
                    Cá Nhân
                  </button>
                  <button
                    onClick={() => handlePromptButton('challenge')}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 disabled:bg-gray-100 text-orange-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Target size={16} />
                    Thử Thách
                  </button>
                  <button
                    onClick={() => handlePromptButton('roadmap')}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-100 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Route size={16} />
                    Lộ Trình
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhập câu hỏi về lịch sử Việt Nam..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Send size={16} />
                  {isLoading ? 'Đang gửi...' : 'Gửi'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-2">Câu hỏi gợi ý</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Chiến dịch Điện Biên Phủ diễn ra như thế nào?</li>
                <li>• Ai là vua đầu tiên của triều Nguyễn?</li>
                <li>• Cách mạng tháng Tám có ý nghĩa gì?</li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-2">Chủ đề phổ biến</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Các triều đại phong kiến</li>
                <li>• Kháng chiến chống thực dân</li>
                <li>• Văn hóa truyền thống</li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-2">Tính năng AI</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Trả lời chính xác</li>
                <li>• Giải thích chi tiết</li>
                <li>• Tương tác thân thiện</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Chatbot;