'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Ecosystem Index · theme: cobalt · designed-as-app */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Tag, Calendar, Terminal } from 'lucide-react';
import { Chat, LLMType } from '@/lib/types';
import { loadPublicChats } from '@/lib/api-storage';
import { getPopularChats, getAllTags } from '@/lib/search';
import { LLM_CONFIGS } from '@/lib/llms';
import LLMBadge from '@/components/LLMBadge';
import Header from '@/components/Header';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [popularChats, setPopularChats] = useState<Chat[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedLLM, setSelectedLLM] = useState<LLMType | ''>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadChatsData = async () => {
      const loadedChats = await loadPublicChats();
      setChats(loadedChats);
      setFilteredChats(loadedChats);
      
      // Get popular chats (top 3)
      const popular = getPopularChats(loadedChats, 3);
      setPopularChats(popular);
      
      // Extract all unique tags
      const tags = getAllTags(loadedChats);
      setAvailableTags(tags);
    };
    
    loadChatsData();
  }, []);

  // Filter handler
  useEffect(() => {
    let filtered = chats;

    if (selectedLLM) {
      filtered = filtered.filter((chat) => chat.llm === selectedLLM);
    }

    if (selectedTag) {
      filtered = filtered.filter((chat) => chat.tags.includes(selectedTag));
    }

    setFilteredChats(filtered);
  }, [selectedLLM, selectedTag, chats]);

  const clearFilters = () => {
    setSelectedLLM('');
    setSelectedTag('');
  };

  const isFiltering = selectedLLM !== '' || selectedTag !== '';

  if (!mounted) {
    return <div className="min-h-screen bg-paper" />; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/20">
      
      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Hero Section (Ecosystem Index: brief paragraph, left-aligned, no shouting display) */}
        <div className="border-b border-rule pb-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-accent mb-2">
            01 · index
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-ink mb-4 max-w-3xl">
            conversations with large language models
          </h1>
          <p className="text-base text-ink-2 max-w-2xl font-body leading-relaxed">
            an open journal documenting coding assistance, technical logic verification, design audits, and creative writing experiments across AI models.
          </p>
        </div>

        {/* Technical Stat Strip (T4 Numbered stat strip: clean tabular columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-rule rounded-card bg-paper-2 divide-y sm:divide-y-0 sm:divide-x divide-rule">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                Total Logs
              </div>
              <div className="text-sm font-body text-ink-2">recorded interactions</div>
            </div>
            <div className="text-3xl font-semibold font-display text-accent tabular-nums">
              {chats.length}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                AI Assistants
              </div>
              <div className="text-sm font-body text-ink-2">different model types</div>
            </div>
            <div className="text-3xl font-semibold font-display text-accent tabular-nums">
              {new Set(chats.map(chat => chat.llm)).size}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                Unique Tags
              </div>
              <div className="text-sm font-body text-ink-2">categories cataloged</div>
            </div>
            <div className="text-3xl font-semibold font-display text-accent tabular-nums">
              {availableTags.length}
            </div>
          </div>
        </div>

        {/* Filter Toolbar (Tabs & Dropdowns) */}
        <div className="border border-rule rounded-card bg-paper-2 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-2 mr-2">
              Model:
            </span>
            <button
              onClick={() => setSelectedLLM('')}
              className={`px-3 py-1 text-xs font-medium rounded-input border transition-colors ${
                selectedLLM === ''
                  ? 'bg-accent border-accent text-accent-ink'
                  : 'bg-paper border-rule text-ink hover:border-accent'
              }`}
            >
              all models
            </button>
            {Object.keys(LLM_CONFIGS).map((llmKey) => {
              const name = LLM_CONFIGS[llmKey as LLMType]?.name || llmKey;
              return (
                <button
                  key={llmKey}
                  onClick={() => setSelectedLLM(llmKey as LLMType)}
                  className={`px-3 py-1 text-xs font-medium rounded-input border transition-colors ${
                    selectedLLM === llmKey
                      ? 'bg-accent border-accent text-accent-ink'
                      : 'bg-paper border-rule text-ink hover:border-accent'
                  }`}
                >
                  {name.toLowerCase()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {availableTags.length > 0 && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                  Tag:
                </span>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-1.5 border border-rule rounded-input bg-paper text-xs text-ink font-body outline-none focus:border-accent"
                >
                  <option value="">all tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isFiltering && (
              <button
                onClick={clearFilters}
                className="font-mono text-[10px] uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors py-1.5"
              >
                clear
              </button>
            )}
          </div>
        </div>

        {/* Search / Filter Active Results Grid */}
        {isFiltering ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-ink-2">
                Filtered logs ({filteredChats.length})
              </h2>
            </div>
            
            {filteredChats.length === 0 ? (
              <div className="text-center py-12 border border-rule border-dashed rounded-card bg-paper-2">
                <Terminal className="w-8 h-8 mx-auto text-ink-2 mb-3 opacity-60" />
                <h3 className="text-sm font-semibold font-display text-ink mb-1">
                  no matching logs
                </h3>
                <p className="text-xs text-ink-2">
                  try clearing filters or adjusting parameters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChats.map((chat) => (
                  <ChatCard key={chat.id} chat={chat} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default Ecosystem Index rails */
          <div className="space-y-12">
            
            {/* Rail 1: Featured Conversations (Sorted by views) */}
            {popularChats.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-rule pb-2">
                  <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-ink-2">
                    featured logs · popular cuts
                  </h2>
                  <span className="font-mono text-[10px] text-ink-2 opacity-60">views count</span>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {popularChats.map((chat) => (
                    <ChatCard key={chat.id} chat={chat} isFeatured />
                  ))}
                </div>
              </div>
            )}

            {/* Rail 2: Latest Conversations (All logs) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-rule pb-2">
                <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-ink-2">
                  all logs · chronicle
                </h2>
                <span className="font-mono text-[10px] text-ink-2 opacity-60">latest first</span>
              </div>

              {chats.length === 0 ? (
                <div className="text-center py-12 border border-rule border-dashed rounded-card bg-paper-2">
                  <Terminal className="w-8 h-8 mx-auto text-ink-2 mb-3 opacity-60" />
                  <h3 className="text-sm font-semibold font-display text-ink mb-1">
                    archive is empty
                  </h3>
                  <p className="text-xs text-ink-2">
                    no conversations have been published to the journal yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {chats.map((chat) => (
                    <ChatCard key={chat.id} chat={chat} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer (Ft2: Inline single line) */}
      <footer className="border-t border-rule bg-paper-2 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink-2">
            <div>
              prompt journal &copy; {new Date().getFullYear()} · abhinav-prabhakar
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Abhinav-Prabhakar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                github
              </a>
              <span>·</span>
              <Link href="/admin" className="hover:text-accent transition-colors">
                admin board
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* Reusable Chat Card Component styled strictly in Cobalt */
function ChatCard({ chat, isFeatured = false }: { chat: Chat; isFeatured?: boolean }) {
  return (
    <Link
      href={`/chat/${chat.slug}`}
      className={`group flex flex-col justify-between border border-rule rounded-card p-5 bg-paper transition-all duration-200 hover:border-accent ${
        isFeatured ? 'bg-paper-2 md:col-span-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : ''
      }`}
    >
      <div className="space-y-3">
        
        {/* Badge & Meta */}
        <div className="flex items-center justify-between">
          <LLMBadge llm={chat.llm} size="sm" />
          <div className="flex items-center gap-1 font-mono text-[9px] text-ink-2 uppercase tracking-wide">
            <Calendar className="w-3 h-3 opacity-60" />
            <span>
              {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold font-display tracking-tight text-ink group-hover:text-accent transition-colors">
          {chat.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-ink-2 font-body leading-relaxed line-clamp-3">
          {chat.excerpt}
        </p>

      </div>

      {/* Tags */}
      {chat.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-rule/60">
          <Tag className="w-3 h-3 text-ink-2 opacity-40 self-center" />
          {chat.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] font-mono bg-paper-3 border border-rule text-ink-2 rounded"
            >
              {tag.toLowerCase()}
            </span>
          ))}
          {chat.tags.length > 3 && (
            <span className="text-[10px] font-mono text-ink-2 opacity-50 self-center">
              +{chat.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}