import { LLMConfig, LLMType } from './types';

export const LLM_CONFIGS: Record<LLMType, LLMConfig> = {
  chatgpt: {
    name: 'ChatGPT',
    logo: '/logos/chatgpt.svg',
    color: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  claude: {
    name: 'Claude',
    logo: '/logos/claude.svg',
    color: 'border-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  gemini: {
    name: 'Gemini',
    logo: '/logos/gemini.svg',
    color: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  gpt4: {
    name: 'GPT-4',
    logo: '/logos/gpt4.svg',
    color: 'border-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950'
  },
  perplexity: {
    name: 'Perplexity',
    logo: '/logos/perplexity.svg',
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
  }
};