import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Share2, Copy } from 'lucide-react';
import { getChatBySlug } from '@/lib/storage';
import ChatViewer from '@/components/ChatViewer';
import LLMBadge from '@/components/LLMBadge';
import ThemeToggle from '@/components/ThemeToggle';

interface ChatPageProps {
  params: {
    slug: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const chat = getChatBySlug(params.slug);

  if (!chat || !chat.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: chat.title,
                      text: chat.excerpt,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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