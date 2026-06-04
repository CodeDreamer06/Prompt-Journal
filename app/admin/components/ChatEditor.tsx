'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: cobalt · designed-as-app */

import { useState } from 'react';
import { Eye, EyeOff, Terminal, Edit3 } from 'lucide-react';
import { LLMType } from '@/lib/types';
import { LLM_CONFIGS } from '@/lib/llms';
import { generateSlug } from '@/lib/api-storage';
import ChatViewer from '@/components/ChatViewer';

interface ChatEditorProps {
  initialData?: {
    title: string;
    content: string;
    llm: LLMType;
    tags: string[];
    isPublished: boolean;
  };
  onSave: (data: {
    title: string;
    content: string;
    llm: LLMType;
    tags: string[];
    isPublished: boolean;
    slug: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ChatEditor({ initialData, onSave, onCancel, isLoading }: ChatEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [llm, setLlm] = useState<LLMType>(initialData?.llm || 'gpt-4o');
  const [tags, setTags] = useState(initialData?.tags.join(', ') || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = generateSlug(title);
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    onSave({
      title,
      content,
      llm,
      tags: tagArray,
      isPublished,
      slug
    });
  };

  const insertTemplate = () => {
    const template = `### 🧑‍💻 User

Your question or prompt here

---

### 🤖 Assistant

The AI's response here with **formatting** and \`code blocks\`

---

### 🧑‍💻 User

Follow-up question

---

### 🤖 Assistant

Another response from the AI`;

    setContent(template);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Header Controls (Technical spec buttons with 6px radii) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-ink px-3 py-1.5 border border-rule rounded-btn bg-paper hover:bg-paper-2 transition-colors"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPreview ? 'hide preview' : 'show preview'}</span>
            </button>
            
            <button
              type="button"
              onClick={insertTemplate}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent hover:underline py-1.5 px-2"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>insert template</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-rule text-accent focus:ring-accent accent-accent bg-paper cursor-pointer"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                publish public
              </span>
            </label>
            
            <button
              type="button"
              onClick={onCancel}
              className="font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-ink transition-colors py-1.5 px-3"
            >
              cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="flex items-center gap-1.5 bg-accent text-accent-ink px-4 py-2 rounded-btn text-xs font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-display"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isLoading ? 'saving...' : 'save log'}</span>
            </button>
          </div>
        </div>

        {/* Form and Preview Split Grid */}
        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-5' : 'grid-cols-1'}`}>
          
          {/* Editor Form */}
          <div className={`space-y-5 ${showPreview ? 'lg:col-span-2' : ''}`}>
            
            {/* Title Input */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block font-mono text-[10px] uppercase tracking-wider text-ink-2"
              >
                Log Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-rule rounded-input bg-paper text-ink font-body outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                placeholder="Enter conversation title..."
                required
              />
            </div>

            {/* Model & Tags inline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* LLM Selector */}
              <div className="space-y-2">
                <label
                  htmlFor="llm"
                  className="block font-mono text-[10px] uppercase tracking-wider text-ink-2"
                >
                  AI Model
                </label>
                <select
                  id="llm"
                  value={llm}
                  onChange={(e) => setLlm(e.target.value as LLMType)}
                  className="w-full px-3 py-2 border border-rule rounded-input bg-paper text-ink font-body outline-none focus:border-accent text-sm"
                >
                  {Object.entries(LLM_CONFIGS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.name.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags input */}
              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="block font-mono text-[10px] uppercase tracking-wider text-ink-2"
                >
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-rule rounded-input bg-paper text-ink font-body outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                  placeholder="react, typescript, css"
                />
              </div>

            </div>

            {/* Markdown Text Area */}
            <div className="space-y-2">
              <label
                htmlFor="content"
                className="block font-mono text-[10px] uppercase tracking-wider text-ink-2"
              >
                Conversation Content (Markdown syntax)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full px-3 py-2 border border-rule rounded-input bg-paper text-ink font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs leading-relaxed"
                placeholder="Paste your conversation here..."
                required
              />
            </div>

          </div>

          {/* Real-time Preview Area */}
          {showPreview && (
            <div className="lg:col-span-3 border border-rule rounded-card bg-paper-2 p-5 flex flex-col space-y-4 max-h-[660px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-rule pb-2">
                <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-ink-2">
                  real-time render preview
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {content.trim() ? (
                  <ChatViewer content={content} />
                ) : (
                  <div className="text-ink-2 text-center py-12 font-mono text-[10px] uppercase">
                    waiting for input content...
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}