import { Chat } from './types';
import { nanoid } from 'nanoid';

// Get admin password from localStorage (set during login)
function getAdminPassword(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('prompt-journal-admin-password') || '';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateExcerpt(content: string): string {
  // Extract first user message
  const userMatch = content.match(/### 🧑‍💻 User\s*\n\n([\s\S]*?)(?=\n\n---|\n\n###|$)/);
  if (userMatch) {
    return userMatch[1].trim().substring(0, 150) + '...';
  }
  
  // Fallback to first 150 characters
  return content.replace(/#{1,6}\s*/g, '').substring(0, 150) + '...';
}

// Public API - Get published chats only
export async function loadPublicChats(): Promise<Chat[]> {
  try {
    const response = await fetch('/api/chats');
    if (!response.ok) throw new Error('Failed to fetch chats');
    return await response.json();
  } catch (error) {
    console.error('Error loading public chats:', error);
    return [];
  }
}

// Admin API - Get all chats (published + drafts)
export async function loadAllChats(): Promise<Chat[]> {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) throw new Error('Admin password required');

    const response = await fetch('/api/chats/admin', {
      headers: {
        'x-admin-password': adminPassword
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch admin chats');
    return await response.json();
  } catch (error) {
    console.error('Error loading admin chats:', error);
    return [];
  }
}

// Get specific chat by slug (public)
export async function getChatBySlug(slug: string): Promise<Chat | null> {
  try {
    const response = await fetch(`/api/chats/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading chat by slug:', error);
    return null;
  }
}

// Admin functions
export async function saveChat(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chat | null> {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) throw new Error('Admin password required');

    const newChat: Chat = {
      ...chat,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      excerpt: generateExcerpt(chat.content)
    };

    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat: newChat,
        adminPassword
      })
    });

    if (!response.ok) throw new Error('Failed to save chat');
    const result = await response.json();
    return result.chat;
  } catch (error) {
    console.error('Error saving chat:', error);
    return null;
  }
}

export async function updateChat(id: string, updates: Partial<Chat>): Promise<Chat | null> {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) throw new Error('Admin password required');

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
      excerpt: updates.content ? generateExcerpt(updates.content) : undefined
    };

    const response = await fetch('/api/chats/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: id,
        updates: updatedData,
        adminPassword
      })
    });

    if (!response.ok) throw new Error('Failed to update chat');
    const result = await response.json();
    return result.chat;
  } catch (error) {
    console.error('Error updating chat:', error);
    return null;
  }
}

export async function deleteChat(id: string): Promise<boolean> {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) throw new Error('Admin password required');

    const response = await fetch('/api/chats/admin', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: id,
        adminPassword
      })
    });

    if (!response.ok) throw new Error('Failed to delete chat');
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
}

// Migration function to move localStorage chats to KV
export async function migrateLocalStorageChats(): Promise<{ success: boolean; message: string }> {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) throw new Error('Admin password required');

    // Get chats from localStorage
    const localChats = localStorage.getItem('prompt-journal-chats');
    if (!localChats) {
      return { success: true, message: 'No local chats to migrate' };
    }

    const chats = JSON.parse(localChats);

    const response = await fetch('/api/chats/migrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chats,
        adminPassword
      })
    });

    if (!response.ok) throw new Error('Failed to migrate chats');
    const result = await response.json();
    
    // Clear localStorage after successful migration
    localStorage.removeItem('prompt-journal-chats');
    
    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error migrating chats:', error);
    return { success: false, message: 'Failed to migrate chats' };
  }
}

// Fallback functions for backward compatibility
export function getChatById(id: string): Chat | null {
  // This will be replaced with API call in components
  console.warn('getChatById should use loadAllChats() instead');
  return null;
}

export function loadChats(): Chat[] {
  // This will be replaced with API call in components
  console.warn('loadChats should use loadPublicChats() or loadAllChats() instead');
  return [];
}

export function exportChats(): string {
  // This will be handled by the admin panel
  console.warn('exportChats should be handled by admin panel');
  return '[]';
}

export function importChats(jsonData: string): boolean {
  // This will be handled by the admin panel
  console.warn('importChats should be handled by admin panel');
  return false;
}