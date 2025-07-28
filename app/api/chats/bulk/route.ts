import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';
import { Chat, BulkOperation } from '@/lib/types';

const CHATS_KEY = 'prompt-journal:chats';

const redis = createClient({
  url: process.env.REDIS_URL
});

// POST /api/chats/bulk - Bulk operations on chats
export async function POST(request: NextRequest) {
  try {
    const { operation, adminPassword }: { operation: BulkOperation; adminPassword: string } = await request.json();
    
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
    
    let result: any = { success: true };
    
    switch (operation.type) {
      case 'delete':
        const beforeCount = chats.length;
        const filteredChats = chats.filter(chat => !operation.chatIds.includes(chat.id));
        await redis.set(CHATS_KEY, JSON.stringify(filteredChats));
        result.deletedCount = beforeCount - filteredChats.length;
        break;
        
      case 'publish':
        chats.forEach(chat => {
          if (operation.chatIds.includes(chat.id)) {
            chat.isPublished = true;
            chat.updatedAt = new Date().toISOString();
          }
        });
        await redis.set(CHATS_KEY, JSON.stringify(chats));
        result.updatedCount = operation.chatIds.length;
        break;
        
      case 'unpublish':
        chats.forEach(chat => {
          if (operation.chatIds.includes(chat.id)) {
            chat.isPublished = false;
            chat.updatedAt = new Date().toISOString();
          }
        });
        await redis.set(CHATS_KEY, JSON.stringify(chats));
        result.updatedCount = operation.chatIds.length;
        break;
        
      case 'list':
        chats.forEach(chat => {
          if (operation.chatIds.includes(chat.id)) {
            chat.isUnlisted = false;
            chat.updatedAt = new Date().toISOString();
          }
        });
        await redis.set(CHATS_KEY, JSON.stringify(chats));
        result.updatedCount = operation.chatIds.length;
        break;
        
      case 'unlist':
        chats.forEach(chat => {
          if (operation.chatIds.includes(chat.id)) {
            chat.isUnlisted = true;
            chat.updatedAt = new Date().toISOString();
          }
        });
        await redis.set(CHATS_KEY, JSON.stringify(chats));
        result.updatedCount = operation.chatIds.length;
        break;
        
      case 'export':
        const chatsToExport = chats.filter(chat => operation.chatIds.includes(chat.id));
        result.data = JSON.stringify(chatsToExport, null, 2);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json({ error: 'Failed to perform bulk operation' }, { status: 500 });
  }
}