import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

const redis = createClient({
  url: process.env.REDIS_URL
});

// GET /api/chats/popular - Get most popular chats by view count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!redis.isOpen) {
      await redis.connect();
    }
    
    const chatsData = await redis.get(CHATS_KEY);
    const chats: Chat[] = chatsData ? JSON.parse(chatsData) : [];
    
    // Get published, non-unlisted chats sorted by views
    const popularChats = chats
      .filter(chat => chat.isPublished && !chat.isUnlisted)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
    
    return NextResponse.json(popularChats);
  } catch (error) {
    console.error('Error fetching popular chats:', error);
    return NextResponse.json({ error: 'Failed to fetch popular chats' }, { status: 500 });
  }
}