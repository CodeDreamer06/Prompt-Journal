'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Share2 } from 'lucide-react';
import { getChatBySlug } from '@/lib/api-storage';
import { Chat } from '@/lib/types';
import ChatViewer from '@/components/ChatViewer';
import LLMBadge from '@/components/LLMBadge';
import ThemeToggle from '@/components/ThemeToggle';

export default function ChatPage() {
  const params = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadChatData = async () => {
      if (params.slug) {
        const loadedChat = await getChatBySlug(params.slug as string);
        if (!loadedChat) {
          setNotFound(true);
        } else {
          setChat(loadedChat);
        }
      }
    };
    
    loadChatData();
  }, [params.slug]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Chat Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This conversation doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Floating Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: chat.title,
                text: chat.excerpt || '',
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors shadow-lg"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Chat Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <LLMBadge llm={chat.llm} />
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
            </time>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {chat.title}
          </h1>
          
          {chat.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chat.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Chat Content */}
        <ChatViewer content={chat.content} />

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Back to Top
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>
              More conversations at{' '}
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                Prompt Journal
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}