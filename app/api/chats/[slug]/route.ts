import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

// GET /api/chats/[slug] - Get specific chat by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
    
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