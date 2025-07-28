import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

const redis = createClient({
  url: process.env.REDIS_URL
});

// GET /api/chats - Get all published chats
export async function GET() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
    
    const chatsData = await redis.get(CHATS_KEY);
    const chats: Chat[] = chatsData ? JSON.parse(chatsData) : [];
    
    // Only return published chats for public API
    const publishedChats = chats.filter(chat => chat.isPublished);
    return NextResponse.json(publishedChats);
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
    
    if (!redis.isOpen) {
      await redis.connect();
    }
    
    // Get existing chats
    const chatsData = await redis.get(CHATS_KEY);
    const chats: Chat[] = chatsData ? JSON.parse(chatsData) : [];
    
    // Add new chat
    chats.push(chat);
    
    // Save back to Redis
    await redis.set(CHATS_KEY, JSON.stringify(chats));
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}