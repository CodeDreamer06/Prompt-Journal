'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Edit, Trash2, Eye, EyeOff, Download, Upload } from 'lucide-react';
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
  // const router = useRouter(); // Unused for now

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
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Admin Login
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Back to Public Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Link>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
          
          <label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {chats.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Chats
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {chats.filter(chat => chat.isPublished).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Published
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {chats.filter(chat => !chat.isPublished).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Drafts
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Conversations
            </h2>
            
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No conversations yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-4">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <LLMBadge llm={chat.llm} size="sm" />
                        {!chat.isPublished && (
                          <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                            Draft
                          </span>
                        )}
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {chat.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {chat.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => togglePublished(chat.id, chat.isPublished)}
                        className={`p-2 rounded transition-colors ${
                          chat.isPublished
                            ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={chat.isPublished ? 'Published' : 'Draft'}
                      >
                        {chat.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <Link
                        href={`/admin/edit/${chat.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(chat.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                        title="Delete"
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
      </div>
    </AdminLayout>
  );
}