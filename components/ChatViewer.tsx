'use client';

import { Copy, Check, User, Terminal } from 'lucide-react';
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
      <div className={`${className} bg-paper p-6 border border-rule rounded-card`}>
        <MarkdownRenderer content={content} variant="page" />
      </div>
    );
  }

  // For conversation pages, parse and render with chat UI
  const messages = parseConversation(content);

  return (
    <div className={`space-y-6 ${className}`}>
      {messages.map((message, index) => {
        const isUser = message.type === 'user';
        
        return (
          <div
            key={index}
            className={`border rounded-card overflow-hidden transition-all duration-200 ${
              isUser
                ? 'bg-paper border-rule'
                : 'bg-paper-2 border-rule-2'
            }`}
          >
            {/* Message Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-rule bg-paper-3/40">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-paper border border-rule">
                  {isUser ? (
                    <User className="w-3 h-3 text-ink-2" />
                  ) : (
                    <Terminal className="w-3 h-3 text-accent" />
                  )}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                  {isUser ? 'user input' : 'assistant reply'}
                </span>
              </div>
              
              <button
                onClick={() => copyToClipboard(message.content, index)}
                className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors py-1 px-2 rounded hover:bg-paper-2 border border-transparent hover:border-rule"
                title="Copy full message content"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>copy</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Message Content */}
            <div className="p-5 sm:p-6 font-body leading-relaxed text-ink text-sm sm:text-base">
              <MarkdownRenderer content={message.content} variant="conversation" />
            </div>

          </div>
        );
      })}
    </div>
  );
}