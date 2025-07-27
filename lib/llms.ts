import { LLMConfig, LLMType } from './types';

export const LLM_CONFIGS: Record<LLMType, LLMConfig> = {
  chatgpt: {
    name: 'ChatGPT',
    logo: '🤖',
    color: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  claude: {
    name: 'Claude',
    logo: '🧠',
    color: 'border-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  gemini: {
    name: 'Gemini',
    logo: '✨',
    color: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  custom: {
    name: 'Custom',
    logo: '⚡',
    color: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  }
};