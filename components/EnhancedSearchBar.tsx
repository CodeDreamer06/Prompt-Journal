'use client';

import { useState, useEffect } from 'react';
import { Search, X, Filter, Eye, EyeOff } from 'lucide-react';
import { Chat, SearchFilters, LLMType } from '@/lib/types';
import { searchChats, getAllTags } from '@/lib/search';
import { LLM_CONFIGS } from '@/lib/llms';

interface EnhancedSearchBarProps {
  chats: Chat[];
  onFilter: (filteredChats: Chat[]) => void;
  className?: string;
}

export default function EnhancedSearchBar({ chats, onFilter, className = '' }: EnhancedSearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    includeUnlisted: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    setAvailableTags(getAllTags(chats));
  }, [chats]);

  useEffect(() => {
    const filtered = searchChats(chats, filters);
    onFilter(filtered);
  }, [chats, filters, onFilter]);

  const handleQueryChange = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleLLMFilter = (llm: LLMType | undefined) => {
    setFilters(prev => ({ ...prev, llm }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      tags: [],
      includeUnlisted: false
    });
  };

  const hasActiveFilters = filters.query || filters.llm || filters.tags.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Advanced filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          {/* LLM Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by LLM:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLLMFilter(undefined)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  !filters.llm
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {Object.entries(LLM_CONFIGS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleLLMFilter(key as LLMType)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.llm === key
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Include unlisted toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, includeUnlisted: !prev.includeUnlisted }))}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                filters.includeUnlisted
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filters.includeUnlisted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Include unlisted conversations
            </button>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm">
          {filters.query && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              Query: &quot;{filters.query}&quot;
            </span>
          )}
          {filters.llm && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
              LLM: {LLM_CONFIGS[filters.llm].name}
            </span>
          )}
          {filters.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              Tag: {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}