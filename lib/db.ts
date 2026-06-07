import { createClient } from '@libsql/client';
import { Chat, LLMType, PageType } from './types';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || ''
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      title TEXT,
      content TEXT,
      llm TEXT,
      pageType TEXT,
      tags TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      isPublished INTEGER DEFAULT 0,
      isUnlisted INTEGER DEFAULT 0,
      excerpt TEXT,
      views INTEGER DEFAULT 0,
      readingTime INTEGER DEFAULT 1,
      isDraft INTEGER DEFAULT 0,
      lastSaved TEXT
    )
  `);
}

// Helper to map SQLite database rows to the Chat typescript type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRowToChat(row: any): Chat {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    content: String(row.content),
    llm: row.llm as LLMType,
    pageType: row.pageType as PageType,
    tags: JSON.parse(String(row.tags || '[]')),
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
    isPublished: row.isPublished === 1 || row.isPublished === true,
    isUnlisted: row.isUnlisted === 1 || row.isUnlisted === true,
    excerpt: row.excerpt ? String(row.excerpt) : undefined,
    views: Number(row.views || 0),
    readingTime: Number(row.readingTime || 1),
    isDraft: row.isDraft === 1 || row.isDraft === true,
    lastSaved: row.lastSaved ? String(row.lastSaved) : undefined
  };
}
