import { LLMConfig, LLMType } from './types';

export const LLM_CONFIGS: Record<LLMType, LLMConfig> = {
  chatgpt: {
    name: '4o',
    logo: '/logos/gpt.png',
    color: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  claude: {
    name: 'Claude',
    logo: '/logos/claude.png',
    color: 'border-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  gemini: {
    name: 'Gemini',
    logo: '/logos/gemini.png',
    color: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  gpt4: {
    name: 'GPT-4',
    logo: '/logos/gpt.png',
    color: 'border-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950'
  },
  perplexity: {
    name: 'Perplexity',
    logo: '/logos/perplexity.png',
    color: 'border-cyan-500',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950'
  },
  llama: {
    name: 'Llama',
    logo: '/logos/llama.svg',
    color: 'border-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950'
  },
  mistral: {
    name: 'Mistral',
    logo: '/logos/mistral.svg',
    color: 'border-indigo-500',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950'
  },
  custom: {
    name: 'Custom',
    logo: '/logos/custom.svg',
    color: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
  grok: {
    name: 'Grok',
    logo: '/logos/grok.png',
    color: 'border-gray-500',
    textColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950'
  },
  deepseek: {
    name: 'DeepSeek',
    logo: '/logos/deepseek.png',
    color: 'border-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950'
  },
  qwen: {
    name: 'Qwen',
    logo: '/logos/qwen.png',
    color: 'border-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950'
  },
  'gpt-reasoning': {
    name: 'o1',
    logo: '/logos/gpt-reasoning.png',
    color: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950'
  }
};