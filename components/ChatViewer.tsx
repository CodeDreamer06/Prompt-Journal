'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, User, Bot, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { parseConversation } from '@/lib/markdown';
import { useTheme } from 'next-themes';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatViewerProps {
  content: string;
  className?: string;
}

export default function ChatViewer({ content, className = '' }: ChatViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messages = parseConversation(content);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyCodeToClipboard = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeBlock(blockId);
      setTimeout(() => setCopiedCodeBlock(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`
            relative group rounded-lg border p-6
            ${message.type === 'user' 
              ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
            }
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`
              p-2 rounded-full
              ${message.type === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }
            `}>
              {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <h3 className="font-semibold text-lg">
              {message.type === 'user' ? 'User' : 'Assistant'}
            </h3>
            <button
              onClick={() => copyToClipboard(message.content, index)}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white dark:hover:bg-gray-800 rounded"
              title="Copy message"
            >
              <Copy className="w-4 h-4" />
              {copiedIndex === index && (
                <span className="absolute -top-8 right-0 bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </button>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  const codeString = String(children).replace(/\n$/, '');
                  const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;
                  
                  return !isInline ? (
                    <div className="relative group my-4">
                      <button
                        onClick={() => copyCodeToClipboard(codeString, blockId)}
                        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-800/80 dark:bg-gray-200/80 hover:bg-gray-800 dark:hover:bg-gray-200 rounded text-white dark:text-gray-900"
                        title="Copy code"
                      >
                        {copiedCodeBlock === blockId ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <SyntaxHighlighter
                        style={mounted && resolvedTheme === 'dark' ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers={true}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          border: 'none',
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                hr: () => (
                  <hr className="my-6 border-none h-px bg-gray-200 dark:bg-gray-700 opacity-40" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
