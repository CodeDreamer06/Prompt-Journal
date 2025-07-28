import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

// GET /api/chats - Get all published chats
export async function GET() {
  try {
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
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
    
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
    chats.push(chat);
    
    await kv.set(CHATS_KEY, chats);
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}