import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

const redis = createClient({
  url: process.env.REDIS_URL
});

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
    
    if (!redis.isOpen) {
      await redis.connect();
    }
    
    // Get existing chats from Redis
    const existingChatsData = await redis.get(CHATS_KEY);
    const existingChats: Chat[] = existingChatsData ? JSON.parse(existingChatsData) : [];
    
    // Merge chats, avoiding duplicates
    const mergedChats = [...existingChats];
    let addedCount = 0;
    
    chats.forEach((chat: Chat) => {
      if (chat.id && !mergedChats.find(existing => existing.id === chat.id)) {
        mergedChats.push(chat);
        addedCount++;
      }
    });
    
    // Save merged chats
    await redis.set(CHATS_KEY, JSON.stringify(mergedChats));
    
    return NextResponse.json({ 
      success: true, 
      message: `Migrated ${addedCount} chats successfully`,
      totalChats: mergedChats.length
    });
  } catch (error) {
    console.error('Error migrating chats:', error);
    return NextResponse.json({ error: 'Failed to migrate chats' }, { status: 500 });
  }
}