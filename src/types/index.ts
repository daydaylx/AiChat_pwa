export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;   // UNIX timestamp (ms)
  updatedAt: number;   // UNIX timestamp (ms)
  model: string;
  messages: Message[];
  avatar?: string;
}
