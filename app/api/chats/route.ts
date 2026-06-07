import { NextRequest, NextResponse } from 'next/server';
import { db, initDb, mapRowToChat } from '@/lib/db';

// GET /api/chats - Get all published chats
export async function GET() {
  try {
    await initDb();
    
    const result = await db.execute(`
      SELECT * FROM chats
      WHERE isPublished = 1 AND isUnlisted = 0
      ORDER BY createdAt DESC
    `);
    
    const chats = result.rows.map(mapRowToChat);
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// POST /api/chats - Create new chat (admin only)
export async function POST(request: NextRequest) {
  try {
    const { chat, adminPassword } = await request.json();
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await initDb();
    
    const {
      id,
      slug,
      title,
      content,
      llm,
      pageType,
      tags,
      createdAt,
      updatedAt,
      isPublished,
      isUnlisted,
      excerpt,
      views,
      readingTime,
      isDraft,
      lastSaved
    } = chat;
    
    await db.execute({
      sql: `INSERT INTO chats (id, slug, title, content, llm, pageType, tags, createdAt, updatedAt, isPublished, isUnlisted, excerpt, views, readingTime, isDraft, lastSaved)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        slug,
        title,
        content,
        llm,
        pageType,
        JSON.stringify(tags || []),
        createdAt,
        updatedAt,
        isPublished ? 1 : 0,
        isUnlisted ? 1 : 0,
        excerpt || '',
        views || 0,
        readingTime || 1,
        isDraft ? 1 : 0,
        lastSaved || null
      ]
    });
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}