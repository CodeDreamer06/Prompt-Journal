'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, Plus } from 'lucide-react';
import { checkAdminAuth, clearAdminAuth } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Admin Panel' }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authenticated = checkAdminAuth();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
    
    if (!authenticated) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    clearAdminAuth();
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Admin Panel
              </Link>
              
              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Public Site
                </Link>
                <Link
                  href="/admin/create"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}