'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Check } from 'lucide-react';
import { LLMType } from '@/lib/types';
import { LLM_CONFIGS } from '@/lib/llms';

interface LLMSelectorProps {
  value: LLMType;
  onChange: (value: LLMType) => void;
  className?: string;
}

export default function LLMSelector({ value, onChange, className = '' }: LLMSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const llmEntries = Object.entries(LLM_CONFIGS) as Array<[LLMType, typeof LLM_CONFIGS[LLMType]]>;
  const activeIndex = llmEntries.findIndex(([key]) => key === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync highlighted index with active selection when opened
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(activeIndex >= 0 ? activeIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, activeIndex]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const highlightedEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (llmKey: LLMType) => {
    onChange(llmKey);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev + 1) % llmEntries.length);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev - 1 + llmEntries.length) % llmEntries.length);
      }
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (isOpen && highlightedIndex >= 0) {
        handleSelect(llmEntries[highlightedIndex][0]);
      } else {
        setIsOpen(true);
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const selectedConfig = LLM_CONFIGS[value];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-rule rounded-input bg-paper text-ink font-body flex items-center justify-between outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm cursor-pointer select-none hover:border-accent"
      >
        <div className="flex items-center gap-2">
          {selectedConfig ? (
            <>
              <Image
                src={selectedConfig.logo}
                alt={`${selectedConfig.name} logo`}
                width={18}
                height={18}
                className="rounded-full flex-shrink-0"
              />
              <span className="text-ink font-medium font-body">{selectedConfig.name.toLowerCase()}</span>
            </>
          ) : (
            <span className="text-ink-2 font-body">select model...</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-ink-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Options dropdown menu */}
      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          aria-label="AI Models"
          className="absolute z-50 mt-1 w-full bg-paper border border-rule rounded-card shadow-lg max-h-60 overflow-y-auto outline-none py-1 focus:outline-none"
        >
          {llmEntries.map(([key, config], index) => {
            const isSelected = key === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <div
                key={key}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(key)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors select-none font-body
                  ${isSelected ? 'bg-accent/10 text-accent font-medium' : 'text-ink'}
                  ${isHighlighted ? 'bg-paper-2' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={config.logo}
                    alt={`${config.name} logo`}
                    width={18}
                    height={18}
                    className="rounded-full flex-shrink-0"
                  />
                  <span>{config.name.toLowerCase()}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
