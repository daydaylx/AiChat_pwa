export interface Message {
  id: string; // JEDES Message-Objekt braucht jetzt eine id!
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: string;
  messages: Message[];
  avatar?: string;
}
