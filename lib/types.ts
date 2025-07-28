export type LLMType = 'gpt-4o' | 'gpt-4.1' | 'gpt-o3' | 'gpt-o4-mini' | 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'qwen-3' | 'grok-4' | 'deepseek-r1' | 'claude-4-sonnet' | 'perplexity-sonar-pro' | 'perplexity-sonar-reasoning';

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