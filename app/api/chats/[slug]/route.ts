import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

const redis = createClient({
  url: process.env.REDIS_URL
});

// GET /api/chats/[slug] - Get specific chat by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!redis.isOpen) {
      await redis.connect();
    }
    
    const chatsData = await redis.get(CHATS_KEY);
    const chats: Chat[] = chatsData ? JSON.parse(chatsData) : [];
    
    const chat = chats.find(chat => chat.slug === slug && chat.isPublished);
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}