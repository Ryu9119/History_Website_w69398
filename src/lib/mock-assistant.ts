export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface MockAssistantResponse {
  text: string;
  delay: number; // milliseconds
}

// Mock responses for different types of questions
const mockResponses: Record<string, string[]> = {
  greeting: [
    "Xin chào! Tôi là trợ lý lịch sử của bạn. Hôm nay tôi có thể giúp gì cho việc học tập của bạn?",
    "Chào bạn! Sẵn sàng khám phá những chủ đề lịch sử thú vị chưa?",
    "Chào mừng! Tôi ở đây để giúp bạn khám phá bức tranh lịch sử phong phú.",
    "Xin chào! Thời kỳ hoặc sự kiện lịch sử nào khiến bạn quan tâm nhất?"
  ],
  vietnam_history: [
    "Việt Nam có một lịch sử phong phú và phức tạp trải dài hàng nghìn năm. Từ các vương quốc cổ đại Văn Lang và Âu Lạc đến thời hiện đại, câu chuyện của Việt Nam là một câu chuyện về sự kiên cường và sự phong phú văn hóa.",
    "Lịch sử Việt Nam được đánh dấu bởi các thời kỳ độc lập và bị ngoại bang cai trị. Các thời kỳ chính bao gồm thời Bắc thuộc (111 TCN - 938 SCN), các triều đại độc lập (938-1887), và thời kỳ thuộc địa dưới sự cai trị của Pháp.",
    "Hành trình lịch sử của Việt Nam bao gồm những nhân vật đáng chú ý như Hai Bà Trưng, những người lãnh đạo cuộc khởi nghĩa đầu tiên chống lại sự cai trị của Trung Quốc vào năm 40-43 SCN, và vua Lê Lợi, người thành lập triều đại Hậu Lê vào năm 1428."
  ],
  world_history: [
    "Lịch sử thế giới bao gồm câu chuyện rộng lớn về nền văn minh nhân loại trên tất cả các lục địa. Từ sự trỗi dậy của các đế chế cổ đại đến thế giới hiện đại kết nối, mỗi thời đại đều đã định hình hiện tại của chúng ta.",
    "Việc nghiên cứu lịch sử thế giới tiết lộ các mô hình trao đổi văn hóa, tiến bộ công nghệ, và các mối quan hệ phức tạp giữa các nền văn minh khác nhau qua thời gian.",
    "Các bước ngoặt quan trọng trong lịch sử thế giới bao gồm Cách mạng Nông nghiệp, sự trỗi dậy và sụp đổ của các đế chế vĩ đại, Thời đại Khám phá, và Cách mạng Công nghiệp."
  ],
  general: [
    "Đó là một câu hỏi thú vị! Lịch sử đầy những câu chuyện và bài học hấp dẫn. Bạn có thể cho tôi biết thêm về khía cạnh cụ thể nào bạn muốn khám phá không?",
    "Câu hỏi hay! Có nhiều cách để tiếp cận chủ đề này. Bạn tò mò nhất về thời kỳ hoặc khu vực nào?",
    "Tôi rất vui được giúp đỡ! Lịch sử cung cấp nhiều góc nhìn về chủ đề này. Bạn muốn biết cụ thể điều gì?",
    "Câu hỏi xuất sắc! Đây là một chủ đề mà các nhà sử học đã nghiên cứu rất kỹ lưỡng. Góc độ nào khiến bạn quan tâm nhất?"
  ],
  default: [
    "Tôi ở đây để giúp bạn học về lịch sử! Hãy thoải mái hỏi tôi về bất kỳ thời kỳ, sự kiện hoặc nhân vật lịch sử nào khiến bạn quan tâm.",
    "Đó là một chủ đề tuyệt vời để khám phá! Lịch sử đầy những câu chuyện hấp dẫn đang chờ được khám phá.",
    "Tôi rất muốn giúp bạn tìm hiểu thêm về điều đó! Khía cạnh cụ thể nào bạn muốn đi sâu vào?",
    "Lịch sử có rất nhiều điều để cung cấp! Thời kỳ hoặc khu vực nào thu hút sự quan tâm của bạn nhất?"
  ]
};

// Keywords to match for response selection
const keywordMap: Record<string, string> = {
  // English keywords
  'hello': 'greeting',
  'hi': 'greeting',
  'hey': 'greeting',
  'vietnam': 'vietnam_history',
  'vietnamese': 'vietnam_history',
  'viet': 'vietnam_history',
  'world': 'world_history',
  'global': 'world_history',
  'empire': 'world_history',
  'ancient': 'general',
  'medieval': 'general',
  'modern': 'general',
  'war': 'general',
  'culture': 'general',
  'civilization': 'general',
  // Vietnamese keywords
  'xin chào': 'greeting',
  'chào': 'greeting',
  'chào bạn': 'greeting',
  'việt nam': 'vietnam_history',
  'việt': 'vietnam_history',
  'lịch sử việt nam': 'vietnam_history',
  'thế giới': 'world_history',
  'lịch sử thế giới': 'world_history',
  'toàn cầu': 'world_history',
  'đế chế': 'world_history',
  'cổ đại': 'general',
  'trung cổ': 'general',
  'hiện đại': 'general',
  'chiến tranh': 'general',
  'văn hóa': 'general',
  'văn minh': 'general'
};

export class MockAssistant {
  private static instance: MockAssistant;
  private messageHistory: ChatMessage[] = [];

  static getInstance(): MockAssistant {
    if (!MockAssistant.instance) {
      MockAssistant.instance = new MockAssistant();
    }
    return MockAssistant.instance;
  }

  // Simulate API delay and response
  async sendMessage(userMessage: string): Promise<MockAssistantResponse> {
    // Add some realistic delay (800-1200ms as specified)
    const delay = Math.random() * 400 + 800; // 800-1200ms
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Determine response category based on keywords
    const responseCategory = this.getResponseCategory(userMessage);
    const responses = mockResponses[responseCategory] || mockResponses.default;
    
    // Select random response
    const responseText = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: responseText,
      delay: Math.round(delay)
    };
  }

  private getResponseCategory(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check for keywords
    for (const [keyword, category] of Object.entries(keywordMap)) {
      if (lowerMessage.includes(keyword)) {
        return category;
      }
    }
    
    return 'default';
  }

  // Add message to history
  addMessage(message: ChatMessage): void {
    this.messageHistory.push(message);
  }

  // Get message history
  getHistory(): ChatMessage[] {
    return [...this.messageHistory];
  }

  // Clear history
  clearHistory(): void {
    this.messageHistory = [];
  }

  // Get last user message for retry functionality
  getLastUserMessage(): string | null {
    for (let i = this.messageHistory.length - 1; i >= 0; i--) {
      if (!this.messageHistory[i].isBot) {
        return this.messageHistory[i].text;
      }
    }
    return null;
  }
}

// Export singleton instance
export const mockAssistant = MockAssistant.getInstance();
