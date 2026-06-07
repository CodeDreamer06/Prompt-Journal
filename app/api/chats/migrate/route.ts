import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { Chat } from '@/lib/types';

// POST /api/chats/migrate - Migrate localStorage chats to KV
export async function POST(request: NextRequest) {
  try {
    const { chats, adminPassword } = await request.json();
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate chats array
    if (!Array.isArray(chats)) {
      return NextResponse.json({ error: 'Invalid chats data' }, { status: 400 });
    }
    
    await initDb();
    
    // Prepare batch statements
    const statements = chats.map((chat: Chat) => ({
      sql: `INSERT OR IGNORE INTO chats (id, slug, title, content, llm, pageType, tags, createdAt, updatedAt, isPublished, isUnlisted, excerpt, views, readingTime, isDraft, lastSaved)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        chat.id,
        chat.slug,
        chat.title,
        chat.content,
        chat.llm,
        chat.pageType || 'conversation',
        JSON.stringify(chat.tags || []),
        chat.createdAt,
        chat.updatedAt,
        chat.isPublished ? 1 : 0,
        chat.isUnlisted ? 1 : 0,
        chat.excerpt || '',
        chat.views || 0,
        chat.readingTime || 1,
        chat.isDraft ? 1 : 0,
        chat.lastSaved || null
      ]
    }));
    
    const results = await db.batch(statements);
    
    let addedCount = 0;
    results.forEach(res => {
      if (res.rowsAffected && res.rowsAffected > 0) {
        addedCount += Number(res.rowsAffected);
      }
    });
    
    // Fetch total chats count
    const countRes = await db.execute(`SELECT COUNT(*) as count FROM chats`);
    const totalChats = Number(countRes.rows[0].count);
    
    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${addedCount} chats successfully`,
      totalChats
    });
  } catch (error) {
    console.error('Error migrating chats:', error);
    return NextResponse.json({ error: 'Failed to migrate chats' }, { status: 500 });
  }
}