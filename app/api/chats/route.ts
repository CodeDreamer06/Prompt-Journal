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
    console.log('POST /api/chats called');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { chat, adminPassword } = body;
    
    // Verify admin password
    console.log('Checking password...');
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      console.log('Password mismatch');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Getting existing chats from KV...');
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
    console.log('Existing chats count:', chats.length);
    
    chats.push(chat);
    console.log('Saving to KV...');
    
    await kv.set(CHATS_KEY, chats);
    console.log('Saved successfully');
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ 
      error: 'Failed to create chat', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}