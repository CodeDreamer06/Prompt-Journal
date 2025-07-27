export type LLMType = 'chatgpt' | 'claude' | 'gemini' | 'gpt4' | 'perplexity' | 'llama' | 'mistral' | 'custom';

export interface Chat {
  id: string;
  slug: string;
  title: string;
  content: string;
  llm: LLMType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  excerpt?: string;
}

export interface LLMConfig {
  name: string;
  logo: string;
  color: string;
  textColor: string;
  bgColor: string;
}

export interface SearchFilters {
  query: string;
  llm?: LLMType;
  tags: string[];
}