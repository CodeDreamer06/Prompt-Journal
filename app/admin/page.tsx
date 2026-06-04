'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: cobalt · designed-as-app */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Edit, Trash2, Eye, EyeOff, Download, Upload, Lock, Terminal } from 'lucide-react';
import { checkAdminAuth, setAdminAuth, verifyPassword } from '@/lib/auth';
import { loadAllChats, deleteChat, updateChat, migrateLocalStorageChats } from '@/lib/api-storage';
import { Chat } from '@/lib/types';
import LLMBadge from '@/components/LLMBadge';
import AdminLayout from './components/AdminLayout';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authenticated = checkAdminAuth();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      loadChatsData();
    }
  }, []);

  const loadChatsData = async () => {
    const loadedChats = await loadAllChats();
    setChats(loadedChats);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyPassword(password)) {
      setAdminAuth(password);
      setIsAuthenticated(true);
      setError('');
      
      // Check for localStorage migration
      const localChats = localStorage.getItem('prompt-journal-chats');
      if (localChats) {
        const result = await migrateLocalStorageChats();
        if (result.success) {
          alert(`Migration successful: ${result.message}`);
        }
      }
      
      await loadChatsData();
    } else {
      setError('Invalid password');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      const success = await deleteChat(id);
      if (success) {
        await loadChatsData();
      } else {
        alert('Failed to delete chat');
      }
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    const success = await updateChat(id, { isPublished: !isPublished });
    if (success) {
      await loadChatsData();
    } else {
      alert('Failed to update chat');
    }
  };

  const handleExport = async () => {
    try {
      const data = JSON.stringify(chats, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        JSON.parse(content); // Parse to validate format
        
        // Use the migration endpoint to import chats
        const result = await migrateLocalStorageChats();
        if (result.success) {
          await loadChatsData();
          alert('Import successful!');
        } else {
          alert('Import failed. Please check the file format.');
        }
      } catch {
        alert('Import failed. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-paper" />;
  }

  // Admin login screen styled strictly in Cobalt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center selection:bg-accent/20">
        <div className="max-w-md w-full mx-4">
          <div className="bg-paper-2 border border-rule-2 rounded-card shadow-lg p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-paper border border-rule flex items-center justify-center mx-auto text-accent shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold font-display tracking-tight text-ink">
                admin panel login
              </h1>
              <p className="text-xs text-ink-2 font-body">
                credentials required to manage conversation logs
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-[10px] uppercase tracking-wider text-ink-2 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-rule rounded-input bg-paper text-ink font-body outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {error && (
                <div className="font-mono text-[10px] text-red-500 uppercase tracking-wide">
                  Error: {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-accent text-accent-ink py-2 px-4 rounded-btn text-sm font-semibold hover:bg-accent/90 transition-colors font-display"
              >
                verify credentials
              </button>
            </form>
            
            <div className="pt-4 border-t border-rule text-center">
              <Link
                href="/"
                className="font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors"
              >
                ← back to public index
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard dashboard view
  return (
    <AdminLayout title="dashboard">
      <div className="space-y-8">
        
        {/* Actions Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between border-b border-rule pb-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/create"
              className="flex items-center gap-1.5 bg-accent text-accent-ink px-3 py-1.5 rounded-btn text-xs font-semibold hover:bg-accent/90 transition-colors font-display"
            >
              <Plus className="w-3.5 h-3.5" />
              new log
            </Link>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 border border-rule bg-paper hover:bg-paper-2 text-ink-2 hover:text-ink px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors font-mono uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              export backup
            </button>
            
            <label className="flex items-center gap-1.5 border border-rule bg-paper hover:bg-paper-2 text-ink-2 hover:text-ink px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors font-mono uppercase tracking-wider cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              import backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-[10px] font-mono uppercase text-ink-2">
            db state: connected
          </div>
        </div>

        {/* Technical Stats Strip (Workbench view) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-rule rounded-card bg-paper-2 divide-y sm:divide-y-0 sm:divide-x divide-rule">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-paper border border-rule flex items-center justify-center text-ink-2 opacity-85 shadow-sm">
                <Terminal className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                  Total Logs
                </div>
                <div className="text-[11px] text-ink-2">all archive assets</div>
              </div>
            </div>
            <div className="text-3xl font-semibold font-display text-accent tabular-nums">
              {chats.length}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-paper border border-rule flex items-center justify-center text-ink-2 opacity-85 shadow-sm">
                <Eye className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                  Published
                </div>
                <div className="text-[11px] text-ink-2">public index logs</div>
              </div>
            </div>
            <div className="text-3xl font-semibold font-display text-green-500 tabular-nums">
              {chats.filter((chat) => chat.isPublished).length}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-paper border border-rule flex items-center justify-center text-ink-2 opacity-85 shadow-sm">
                <EyeOff className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-2">
                  Drafts
                </div>
                <div className="text-[11px] text-ink-2">offline workspace drafts</div>
              </div>
            </div>
            <div className="text-3xl font-semibold font-display text-orange-500 tabular-nums">
              {chats.filter((chat) => !chat.isPublished).length}
            </div>
          </div>
        </div>

        {/* Spec List Card (Tabular list of conversations) */}
        <div className="border border-rule rounded-card bg-paper overflow-hidden">
          <div className="px-5 py-4 border-b border-rule bg-paper-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-ink-2">
              All Conversation Logs
            </h2>
            <span className="font-mono text-[10px] text-ink-2 opacity-65">
              {chats.length} assets listed
            </span>
          </div>

          {chats.length === 0 ? (
            <div className="p-12 text-center text-sm text-ink-2 font-body">
              no logs found. create your first conversation to populate the database.
            </div>
          ) : (
            <div className="divide-y divide-rule font-body">
              {chats.map((chat, idx) => (
                <div
                  key={chat.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-paper-2 transition-all"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[10px] text-ink-2 opacity-40">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <LLMBadge llm={chat.llm} size="sm" />
                      {!chat.isPublished && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-400 rounded">
                          draft
                        </span>
                      )}
                      {chat.isUnlisted && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-paper-3 border border-rule text-ink-2 rounded">
                          unlisted
                        </span>
                      )}
                      <time className="text-[10px] font-mono text-ink-2 uppercase">
                        {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                    
                    <h3 className="text-base font-semibold font-display text-ink leading-tight">
                      {chat.title}
                    </h3>
                    <p className="text-xs text-ink-2 truncate max-w-2xl font-body">
                      {chat.excerpt || 'no excerpt provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => togglePublished(chat.id, chat.isPublished)}
                      className={`p-2 border rounded-btn transition-colors ${
                        chat.isPublished
                          ? 'border-green-500/20 bg-green-500/5 text-green-500 hover:bg-green-500/10'
                          : 'border-rule bg-paper text-ink-2 hover:bg-paper-3 hover:text-ink'
                      }`}
                      title={chat.isPublished ? 'published (click to draft)' : 'draft (click to publish)'}
                    >
                      {chat.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <Link
                      href={`/admin/edit/${chat.id}`}
                      className="p-2 border border-rule bg-paper text-ink-2 hover:text-accent hover:border-accent/40 rounded-btn transition-all"
                      title="Edit Log"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="p-2 border border-rule bg-paper text-ink-2 hover:text-red-500 hover:border-red-500/30 rounded-btn transition-all"
                      title="Delete Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}