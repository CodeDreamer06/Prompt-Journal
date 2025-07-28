'use client';

import { Copy, User, Bot } from 'lucide-react';
import { useState } from 'react';
import { parseConversation } from '@/lib/markdown';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatViewerProps {
  content: string;
  pageType?: 'conversation' | 'markdown';
  className?: string;
}

export default function ChatViewer({ content, pageType = 'conversation', className = '' }: ChatViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // For pure markdown pages, render directly without conversation parsing
  if (pageType === 'markdown') {
    return (
      <div className={`${className}`}>
        <MarkdownRenderer content={content} variant="page" />
      </div>
    );
  }

  // For conversation pages, parse and render with chat UI
  const messages = parseConversation(content);

  return (
    <div className={`space-y-8 ${className}`}>
      {messages.map((message, index) => (
        <div key={index} className="group relative">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {message.type === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              
              <button
                onClick={() => copyToClipboard(message.content, index)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Copy message"
              >
                {copiedIndex === index ? (
                  <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="ml-12">
            <MarkdownRenderer content={message.content} variant="conversation" />
          </div>
        </div>
      ))}
    </div>
  );
}