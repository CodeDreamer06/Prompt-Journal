'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: cobalt · designed-as-app */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, Plus, Terminal } from 'lucide-react';
import { checkAdminAuth, clearAdminAuth } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'dashboard' }: AdminLayoutProps) {
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
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/20">
      
      {/* Admin Header */}
      <header className="border-b border-rule bg-paper-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-lg font-bold font-display tracking-tight text-ink hover:text-accent transition-colors">
                  prompt journal
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent border border-accent/30 bg-accent/5 px-2 py-0.5 rounded">
                  admin
                </span>
              </Link>
              
              <nav className="hidden sm:flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>public index</span>
                </Link>
                <Link
                  href="/admin/create"
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-accent transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>new log</span>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-red-500 transition-colors py-1.5 px-2 border border-rule hover:border-red-500/30 rounded"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (Workbench Layout) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page title and location indicator */}
        <div className="border-b border-rule pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-2">
              <Terminal className="w-3 h-3 text-accent" />
              <span>workbench / {title}</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-ink mt-1">
              {title}
            </h1>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div>
          {children}
        </div>

      </main>
    </div>
  );
}