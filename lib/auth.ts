'use client';

const ADMIN_SESSION_KEY = 'prompt-journal-admin';

export function checkAdminAuth(): boolean {
  if (typeof window === 'undefined') return false;
  
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  return session === 'authenticated';
}

export function setAdminAuth(password: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
    sessionStorage.setItem('prompt-journal-admin-password', password);
  }
}

export function clearAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem('prompt-journal-admin-password');
  }
}

export function verifyPassword(password: string): boolean {
  // In a real app, this would be handled server-side
  // For now, we'll use a simple client-side check
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  return password === adminPassword;
}