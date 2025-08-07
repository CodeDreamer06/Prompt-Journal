import { LLMConfig, LLMType } from './types';

export const LLM_CONFIGS: Record<LLMType, LLMConfig> = {
  'gpt-4o': {
    name: '4o',
    logo: '/logos/gpt.png',
    color: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  'gpt-4.1': {
    name: '4.1',
    logo: '/logos/gpt.png',
    color: 'border-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  'gpt-o3': {
    name: 'o3',
    logo: '/logos/gpt-reasoning.png',
    color: 'border-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950'
  },
  'gpt-o4-mini': {
    name: 'o4-mini',
    logo: '/logos/gpt-reasoning.png',
    color: 'border-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950'
  },
  'gemini-2.5-flash': {
    name: '2.5-flash',
    logo: '/logos/gemini.png',
    color: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  'gemini-2.5-pro': {
    name: '2.5-pro',
    logo: '/logos/gemini.png',
    color: 'border-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  'qwen-3': {
    name: 'qwen-3',
    logo: '/logos/qwen.png',
    color: 'border-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950'
  },
  'grok-4': {
    name: 'grok-4',
    logo: '/logos/grok.png',
    color: 'border-gray-500',
    textColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950'
  },
  'deepseek-r1': {
    name: 'r1',
    logo: '/logos/deepseek.png',
    color: 'border-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950'
  },
  'claude-4-sonnet': {
    name: '4-sonnet',
    logo: '/logos/claude.png',
    color: 'border-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  'perplexity-sonar-pro': {
    name: 'sonar-pro',
    logo: '/logos/perplexity.png',
    color: 'border-cyan-500',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950'
  },
  'perplexity-sonar-reasoning': {
    name: 'sonar-reasoning',
    logo: '/logos/perplexity.png',
    color: 'border-cyan-500',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950'
  },
  'k2': {
    name: 'k2',
    logo: '/logos/moonshot.png',
    color: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  }
};