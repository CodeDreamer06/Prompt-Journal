import Image from 'next/image';
import { LLMType } from '@/lib/types';
import { LLM_CONFIGS } from '@/lib/llms';

interface LLMBadgeProps {
  llm: LLMType;
  size?: 'sm' | 'md' | 'lg';
}

export default function LLMBadge({ llm, size = 'md' }: LLMBadgeProps) {
  const config = LLM_CONFIGS[llm];
  
  // Fallback if config doesn't exist
  if (!config) {
    return (
      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
        {llm || 'Unknown LLM'}
      </span>
    );
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const logoSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border-2 font-medium
      ${config.color} ${config.textColor} ${config.bgColor}
      ${sizeClasses[size]}
    `}>
      <Image
        src={config.logo}
        alt={`${config.name} logo`}
        width={logoSizes[size]}
        height={logoSizes[size]}
        className="flex-shrink-0 rounded-full"
      />
      {config.name}
    </span>
  );
}