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
    ? 'prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-li:leading-relaxed prose-pre:p-0 prose-pre:m-0'
    : 'prose dark:prose-invert max-w-none prose-pre:p-0 prose-pre:m-0';

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
              <div className="relative my-0">
                <div className="group relative">
                  <button
                    onClick={() => copyCodeToClipboard(codeString, blockId)}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 bg-black/40 dark:bg-black/60 hover:bg-black/60 dark:hover:bg-black/80 rounded text-gray-300 hover:text-white backdrop-blur-sm"
                    title="Copy code"
                  >
                    {copiedCodeBlock === blockId ? (
                      <span className="text-xs text-green-400 font-medium px-1">Copied!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
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
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: 'transparent',
                      backgroundColor: mounted && resolvedTheme === 'dark' ? '#1f2937' : '#f9fafb',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
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