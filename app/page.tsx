'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus, Settings } from 'lucide-react';
import { Chat } from '@/lib/types';
import { loadChats } from '@/lib/storage';
import LLMBadge from '@/components/LLMBadge';
import SearchBar from '@/components/SearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import Fuse from 'fuse.js';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedChats = loadChats().filter(chat => chat.isPublished);
    setChats(loadedChats);
    setFilteredChats(loadedChats);
    
    // Extract all unique tags
    const tags = Array.from(new Set(loadedChats.flatMap(chat => chat.tags)));
    setAvailableTags(tags);
  }, []);

  const handleSearch = (query: string, llm?: string, tags: string[] = []) => {
    let filtered = chats;

    // Filter by LLM
    if (llm) {
      filtered = filtered.filter(chat => chat.llm === llm);
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter(chat => 
        tags.every(tag => chat.tags.includes(tag))
      );
    }

    // Search by query
    if (query.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['title', 'content', 'excerpt'],
        threshold: 0.3,
      });
      filtered = fuse.search(query).map(result => result.item);
    }

    setFilteredChats(filtered);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prompt Journal
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                by CodeDreamer06
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/admin"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            LLM Conversations
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore interesting conversations with AI assistants. From coding help to creative writing, 
            discover insights from various LLM interactions.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} availableTags={availableTags} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {chats.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Conversations
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {new Set(chats.map(chat => chat.llm)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Different LLMs
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {availableTags.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Unique Tags
            </div>
          </div>
        </div>

        {/* Chat List */}
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No conversations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {chats.length === 0 
                ? "No conversations have been published yet."
                : "Try adjusting your search filters."
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.slug}`}
                className="group block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <LLMBadge llm={chat.llm} size="sm" />
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                    </time>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {chat.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {chat.excerpt}
                  </p>
                  
                  {chat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {chat.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {chat.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-500">
                          +{chat.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>
              Built with love by{' '}
              <a
                href="https://github.com/CodeDreamer06"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                CodeDreamer06
              </a>
            </p>
            <p className="mt-2 text-sm">
              Powered by Next.js, Tailwind CSS, and lots of coffee
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}