import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_URL!.split('@')[0].split('//')[1].split(':')[1]
});
import { Chat } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

// GET /api/chats/admin - Get all chats (published + drafts) for admin
export async function GET(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching admin chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// PUT /api/chats/admin - Update chat
export async function PUT(request: NextRequest) {
  try {
    const { chatId, updates, adminPassword } = await request.json();
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
    const index = chats.findIndex(chat => chat.id === chatId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    chats[index] = { ...chats[index], ...updates, updatedAt: new Date().toISOString() };
    await kv.set(CHATS_KEY, chats);
    
    return NextResponse.json({ success: true, chat: chats[index] });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

// DELETE /api/chats/admin - Delete chat
export async function DELETE(request: NextRequest) {
  try {
    const { chatId, adminPassword } = await request.json();
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const chats = await kv.get<Chat[]>(CHATS_KEY) || [];
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    if (filteredChats.length === chats.length) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    await kv.set(CHATS_KEY, filteredChats);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}