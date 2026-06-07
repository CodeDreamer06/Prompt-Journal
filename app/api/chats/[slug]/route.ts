import { NextRequest, NextResponse } from 'next/server';
import { db, initDb, mapRowToChat } from '@/lib/db';

// GET /api/chats/[slug] - Get specific chat by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await initDb();
    
    const result = await db.execute({
      sql: `SELECT * FROM chats WHERE slug = ? AND isPublished = 1`,
      args: [slug]
    });
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    const chat = mapRowToChat(result.rows[0]);
    
    // Increment view count
    await db.execute({
      sql: `UPDATE chats SET views = views + 1 WHERE id = ?`,
      args: [chat.id]
    });
    chat.views += 1;
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}