'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'conversation' | 'page';
}

export default function MarkdownRenderer({ 
  content, 
  className = '', 
  variant = 'conversation' 
}: MarkdownRendererProps) {
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCodeToClipboard = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeBlock(blockId);
      setTimeout(() => setCopiedCodeBlock(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const baseProseClasses = variant === 'page' 
    ? 'prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed'
    : 'prose dark:prose-invert max-w-none';

  return (
    <div className={`${baseProseClasses} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            const codeString = String(children).replace(/\n$/, '');
            const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;
            
            return !isInline ? (
              <div className="relative group my-4">
                <button
                  onClick={() => copyCodeToClipboard(codeString, blockId)}
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-700/60 dark:bg-gray-600/60 hover:bg-gray-700/80 dark:hover:bg-gray-600/80 rounded text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200"
                  title="Copy code"
                >
                  {copiedCodeBlock === blockId ? (
                    <span className="text-xs text-green-400">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <SyntaxHighlighter
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={(mounted && resolvedTheme === 'dark' ? oneDark : oneLight) as any}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers={false}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: mounted && resolvedTheme === 'dark' ? '#1a1a1a' : '#f8f8f8',
                  }}
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
        {content}
      </ReactMarkdown>
    </div>
  );
}