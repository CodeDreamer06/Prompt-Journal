'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Settings, X, Command } from 'lucide-react';
import { Chat } from '@/lib/types';
import { loadPublicChats } from '@/lib/api-storage';
import { searchChats, getPopularChats } from '@/lib/search';
import ThemeToggle from './ThemeToggle';
import LLMBadge from './LLMBadge';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [results, setResults] = useState<Chat[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load chats on mount
  useEffect(() => {
    const loadChats = async () => {
      const publicChats = await loadPublicChats();
      setChats(publicChats);
    };
    loadChats();
  }, []);

  // Listen for ⌘K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger search logic when query changes
  useEffect(() => {
    if (!isOpen) return;

    if (query.trim() === '') {
      // Show popular chats as default suggestion
      setResults(getPopularChats(chats, 5));
    } else {
      const searchResults = searchChats(chats, { query, tags: [], includeUnlisted: false });
      setResults(searchResults.slice(0, 5));
    }
    setSelectedIndex(0);
  }, [query, chats, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (chat: Chat) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/chat/${chat.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Close when clicking outside of modal container
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <header className="border-b border-rule bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand */}
            <div className="flex items-center gap-2">
              <Link href="/" className="group">
                <span className="text-xl font-bold font-display tracking-tight text-ink hover:text-accent transition-colors">
                  prompt journal
                </span>
              </Link>
              <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-ink-2 bg-paper-2 px-2 py-0.5 rounded border border-rule">
                v2.1.0
              </span>
            </div>

            {/* Center: Search trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-between w-full max-w-sm px-3 py-1.5 mx-4 border border-rule rounded-input bg-paper-2 text-ink-2 hover:border-accent hover:text-ink transition-all cursor-text text-left text-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-ink-2" />
                <span className="font-body">search conversations...</span>
              </div>
              <div className="hidden md:flex items-center gap-0.5 font-mono text-[10px] text-ink-2 bg-paper border border-rule px-1.5 py-0.5 rounded">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </button>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="font-mono text-xs uppercase tracking-wider text-ink-2 hover:text-accent transition-colors p-2"
                title="Admin Dashboard"
              >
                <Settings className="w-4 h-4" />
              </Link>
              <ThemeToggle />
            </div>

          </div>
        </div>
      </header>

      {/* ⌘K Command Palette Modal */}
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-ink/30 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg mx-4 bg-paper border border-rule-2 rounded-card shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Search Input bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-rule">
              <Search className="w-5 h-5 text-ink-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search conversations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-0 outline-none text-base text-ink placeholder-ink-2 font-body"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-paper-2 text-ink-2"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink-2 font-body">
                  No conversations found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-ink-2">
                    {query.trim() === '' ? 'Popular Conversations' : 'Search Results'}
                  </div>
                  
                  {results.map((chat, idx) => (
                    <div
                      key={chat.id}
                      onClick={() => handleSelect(chat)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-input cursor-pointer transition-all border ${
                        idx === selectedIndex
                          ? 'bg-paper-3 border-accent'
                          : 'border-transparent hover:bg-paper-2'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <LLMBadge llm={chat.llm} size="sm" />
                          <span className="text-[10px] font-mono text-ink-2">
                            {new Date(chat.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold font-display text-ink truncate">
                          {chat.title}
                        </h4>
                      </div>
                      <span className="font-mono text-[10px] text-ink-2 opacity-50 ml-2">
                        Enter
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hint Footer */}
            <div className="px-4 py-2 border-t border-rule bg-paper-2 flex items-center justify-between text-[10px] font-mono text-ink-2">
              <div className="flex gap-4">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </div>
              <span>esc close</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
