import { Chat } from './types';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'prompt-journal-chats';

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

export function saveChats(chats: Chat[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }
}

export function loadChats(): Chat[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const chats = stored ? JSON.parse(stored) : [];
    
    // Ensure all chats have required properties
    return chats.map((chat: any) => ({
      id: chat.id || '',
      slug: chat.slug || '',
      title: chat.title || 'Untitled',
      content: chat.content || '',
      llm: chat.llm || 'gpt-4o',
      tags: Array.isArray(chat.tags) ? chat.tags : [],
      createdAt: chat.createdAt || new Date().toISOString(),
      updatedAt: chat.updatedAt || new Date().toISOString(),
      isPublished: Boolean(chat.isPublished),
      excerpt: chat.excerpt || ''
    }));
  } catch {
    return [];
  }
}

export function saveChat(chat: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Chat {
  const chats = loadChats();
  const now = new Date().toISOString();
  
  const newChat: Chat = {
    ...chat,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
    excerpt: generateExcerpt(chat.content)
  };
  
  chats.push(newChat);
  saveChats(chats);
  return newChat;
}

export function updateChat(id: string, updates: Partial<Chat>): Chat | null {
  const chats = loadChats();
  const index = chats.findIndex(chat => chat.id === id);
  
  if (index === -1) return null;
  
  const updatedChat = {
    ...chats[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    excerpt: updates.content ? generateExcerpt(updates.content) : chats[index].excerpt
  };
  
  chats[index] = updatedChat;
  saveChats(chats);
  return updatedChat;
}

export function deleteChat(id: string): boolean {
  const chats = loadChats();
  const filtered = chats.filter(chat => chat.id !== id);
  
  if (filtered.length === chats.length) return false;
  
  saveChats(filtered);
  return true;
}

export function getChatBySlug(slug: string): Chat | null {
  const chats = loadChats();
  return chats.find(chat => chat.slug === slug) || null;
}

export function getChatById(id: string): Chat | null {
  const chats = loadChats();
  return chats.find(chat => chat.id === id) || null;
}

export function exportChats(): string {
  const chats = loadChats();
  return JSON.stringify(chats, null, 2);
}

export function importChats(jsonData: string): boolean {
  try {
    const importedChats = JSON.parse(jsonData) as Chat[];
    
    // Validate structure
    if (!Array.isArray(importedChats)) return false;
    
    const existingChats = loadChats();
    const mergedChats = [...existingChats];
    
    importedChats.forEach(chat => {
      if (chat.id && chat.title && chat.content) {
        // Check if chat already exists
        const existingIndex = mergedChats.findIndex(existing => existing.id === chat.id);
        if (existingIndex === -1) {
          mergedChats.push(chat);
        }
      }
    });
    
    saveChats(mergedChats);
    return true;
  } catch {
    return false;
  }
}