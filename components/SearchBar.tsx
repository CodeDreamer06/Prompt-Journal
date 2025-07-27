'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { LLMType } from '@/lib/types';
import { LLM_CONFIGS } from '@/lib/llms';

interface SearchBarProps {
  onSearch: (query: string, llm?: LLMType, tags?: string[]) => void;
  availableTags: string[];
}

export default function SearchBar({ onSearch, availableTags }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedLLM, setSelectedLLM] = useState<LLMType | ''>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch(query, selectedLLM || undefined, selectedTags);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedLLM('');
    setSelectedTags([]);
    onSearch('', undefined, []);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedLLM}
          onChange={(e) => setSelectedLLM(e.target.value as LLMType | '')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All LLMs</option>
          {Object.entries(LLM_CONFIGS).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        
        {(query || selectedLLM || selectedTags.length > 0) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 py-1">Tags:</span>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-1 text-sm rounded-full border transition-colors
                ${selectedTags.includes(tag)
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}