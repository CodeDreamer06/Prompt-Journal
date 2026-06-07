import { NextRequest, NextResponse } from 'next/server';
import { db, initDb, mapRowToChat } from '@/lib/db';

// GET /api/chats/popular - Get most popular chats by view count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    await initDb();
    
    const result = await db.execute({
      sql: `SELECT * FROM chats
            WHERE isPublished = 1 AND isUnlisted = 0
            ORDER BY views DESC
            LIMIT ?`,
      args: [limit]
    });
    
    const popularChats = result.rows.map(mapRowToChat);
    
    return NextResponse.json(popularChats);
  } catch (error) {
    console.error('Error fetching popular chats:', error);
    return NextResponse.json({ error: 'Failed to fetch popular chats' }, { status: 500 });
  }
}