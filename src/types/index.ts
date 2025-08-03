export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  model: string;
}
