// Message Types
export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  systemPrompt: string;
  createdAt: number;
  updatedAt: number;
}

// Model Types
export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  contextLength: number;
  provider: string;
  pricing?: {
    input: number;
    output: number;
  };
  tags: string[];
  isFree: boolean;
  isFiltered: boolean;
  isRecommended?: boolean;
}

export interface ModelResponse {
  data: AIModel[];
  error?: string;
}

// API Types
export interface OpenRouterCompletionRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterCompletionResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Settings Types
export interface Settings {
  apiKey: string;
  theme: 'light' | 'dark' | 'system';
  defaultSystemPrompt: string;
  defaultModel: string;
  messageSoundEnabled: boolean;
  autoSaveInterval: number;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// UI Types
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

// Utils
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'provider' | 'contextLength' | 'isFree';

// Theme
export type Theme = 'light' | 'dark' | 'system';
