import Image from 'next/image';
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
        className="flex-shrink-0"
      />
      {config.name}
    </span>
  );
}