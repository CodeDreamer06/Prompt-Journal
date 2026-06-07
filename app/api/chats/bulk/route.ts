import { NextRequest, NextResponse } from 'next/server';
import { db, initDb, mapRowToChat } from '@/lib/db';
import { BulkOperation } from '@/lib/types';

// POST /api/chats/bulk - Bulk operations on chats
export async function POST(request: NextRequest) {
  try {
    const { operation, adminPassword }: { operation: BulkOperation; adminPassword: string } = await request.json();
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!operation.chatIds || operation.chatIds.length === 0) {
      return NextResponse.json({ error: 'No chat IDs provided' }, { status: 400 });
    }
    
    await initDb();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: { success: boolean; [key: string]: any } = { success: true };
    const placeholders = operation.chatIds.map(() => '?').join(', ');
    const updatedAt = new Date().toISOString();
    
    switch (operation.type) {
      case 'delete':
        const delRes = await db.execute({
          sql: `DELETE FROM chats WHERE id IN (${placeholders})`,
          args: operation.chatIds
        });
        result.deletedCount = Number(delRes.rowsAffected);
        break;
        
      case 'publish':
        const pubRes = await db.execute({
          sql: `UPDATE chats SET isPublished = 1, updatedAt = ? WHERE id IN (${placeholders})`,
          args: [updatedAt, ...operation.chatIds]
        });
        result.updatedCount = Number(pubRes.rowsAffected);
        break;
        
      case 'unpublish':
        const unpubRes = await db.execute({
          sql: `UPDATE chats SET isPublished = 0, updatedAt = ? WHERE id IN (${placeholders})`,
          args: [updatedAt, ...operation.chatIds]
        });
        result.updatedCount = Number(unpubRes.rowsAffected);
        break;
        
      case 'list':
        const listRes = await db.execute({
          sql: `UPDATE chats SET isUnlisted = 0, updatedAt = ? WHERE id IN (${placeholders})`,
          args: [updatedAt, ...operation.chatIds]
        });
        result.updatedCount = Number(listRes.rowsAffected);
        break;
        
      case 'unlist':
        const unlistRes = await db.execute({
          sql: `UPDATE chats SET isUnlisted = 1, updatedAt = ? WHERE id IN (${placeholders})`,
          args: [updatedAt, ...operation.chatIds]
        });
        result.updatedCount = Number(unlistRes.rowsAffected);
        break;
        
      case 'export':
        const exportRes = await db.execute({
          sql: `SELECT * FROM chats WHERE id IN (${placeholders})`,
          args: operation.chatIds
        });
        const chatsToExport = exportRes.rows.map(mapRowToChat);
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