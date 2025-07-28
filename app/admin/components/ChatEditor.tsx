'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              type="button"
              onClick={insertTemplate}
              className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            >
              Insert Template
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Published
              </span>
            </label>
            
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-5' : 'grid-cols-1'}`}>
          {/* Editor */}
          <div className={`space-y-4 ${showPreview ? 'lg:col-span-2' : ''}`}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter conversation title..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="llm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LLM
                </label>
                <select
                  id="llm"
                  value={llm}
                  onChange={(e) => setLlm(e.target.value as LLMType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(LLM_CONFIGS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.logo} {config.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="react, javascript, coding..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Paste your conversation here..."
                required
              />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:col-span-3 border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview
              </h3>
              {content.trim() ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ChatViewer content={content} />
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Enter content to see preview
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}