import { LLMType } from '@/lib/types';
import { LLM_CONFIGS } from '@/lib/llms';

interface LLMBadgeProps {
  llm: LLMType;
  size?: 'sm' | 'md' | 'lg';
}

export default function LLMBadge({ llm, size = 'md' }: LLMBadgeProps) {
  const config = LLM_CONFIGS[llm];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border-2 font-medium
      ${config.color} ${config.textColor} ${config.bgColor}
      ${sizeClasses[size]}
    `}>
      <span>{config.logo}</span>
      {config.name}
    </span>
  );
}