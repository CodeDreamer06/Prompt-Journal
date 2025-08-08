export type LLMType = 'gpt-4o' | 'gpt-4.1' | 'gpt-5' | 'gpt-o3' | 'gpt-o4-mini' | 'k2' | 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'qwen-3' | 'grok-4' | 'deepseek-r1' | 'claude-4-sonnet' | 'perplexity-sonar-pro' | 'perplexity-sonar-reasoning';

export type PageType = 'conversation' | 'markdown';

export interface Chat {
  id: string;
  slug: string;
  title: string;
  content: string;
  llm: LLMType;
  pageType: PageType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isUnlisted: boolean;
  excerpt?: string;
  views: number;
  readingTime: number;
  isDraft: boolean;
  lastSaved?: string;
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
  includeUnlisted?: boolean;
}

export interface BulkOperation {
  type: 'delete' | 'publish' | 'unpublish' | 'list' | 'unlist' | 'export';
  chatIds: string[];
}