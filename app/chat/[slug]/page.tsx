'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Long Document · theme: cobalt · designed-as-app */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Share2, Calendar, Eye, Check } from 'lucide-react';
import { getChatBySlug, updateChat } from '@/lib/api-storage';
import { Chat } from '@/lib/types';
import ChatViewer from '@/components/ChatViewer';
import LLMBadge from '@/components/LLMBadge';
import Header from '@/components/Header';

export default function ChatPage() {
  const params = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadChatData = async () => {
      if (params.slug) {
        const loadedChat = await getChatBySlug(params.slug as string);
        if (!loadedChat) {
          setNotFound(true);
        } else {
          setChat(loadedChat);
          // Increment views count optimistic check
          updateChat(loadedChat.id, { views: (loadedChat.views || 0) + 1 });
        }
      }
    };
    
    loadChatData();
  }, [params.slug]);

  const handleShare = () => {
    if (navigator.share && chat) {
      navigator.share({
        title: chat.title,
        text: chat.excerpt || '',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-between">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-bold font-display text-ink mb-2">
            chat not found
          </h1>
          <p className="text-sm text-ink-2 mb-6">
            this conversation doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-ink rounded-btn text-sm hover:bg-accent/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            back to home
          </Link>
        </main>
        <footer className="border-t border-rule py-6 text-center text-xs font-mono text-ink-2">
          prompt journal · codedreamer06
        </footer>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/20">
      
      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Area (Long Document: centered measure, high-readability column) */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        
        {/* Navigation back link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors py-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>back to index</span>
          </Link>
        </div>

        {/* Chat metadata and Heading */}
        <div className="border-b border-rule pb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <LLMBadge llm={chat.llm} />
            <div className="flex items-center gap-3 font-mono text-[10px] text-ink-2 uppercase tracking-wide">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 opacity-60" />
                {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 opacity-60" />
                {chat.views || 0} views
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-ink">
            {chat.title.toLowerCase()}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Tags list */}
            {chat.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {chat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono bg-paper-2 border border-rule text-ink-2 rounded"
                  >
                    {tag.toLowerCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors py-1 px-2.5 rounded hover:bg-paper-2 border border-rule"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">link copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>share log</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conversation viewer stream */}
        <ChatViewer content={chat.content} pageType={chat.pageType} />

        {/* Back to Top */}
        <div className="pt-8 border-t border-rule text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors py-1 px-3 border border-rule rounded hover:bg-paper-2"
          >
            back to top ↑
          </button>
        </div>

      </main>

      {/* Footer (Ft2: Inline single line) */}
      <footer className="border-t border-rule bg-paper-2 mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center text-xs font-mono text-ink-2">
          <p>
            more logs available at{' '}
            <Link href="/" className="text-accent hover:underline">
              prompt journal
            </Link>
          </p>
        </div>
      </footer>

    </div>
  );
}