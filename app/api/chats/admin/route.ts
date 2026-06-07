import { NextRequest, NextResponse } from 'next/server';
import { db, initDb, mapRowToChat } from '@/lib/db';

// GET /api/chats/admin - Get all chats (published + drafts) for admin
export async function GET(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    
    // Verify admin password
    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await initDb();
    const result = await db.execute(`SELECT * FROM chats ORDER BY createdAt DESC`);
    const chats = result.rows.map(mapRowToChat);
    
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
    
    await initDb();
    
    // Build dynamic update query
    const setStatements: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: any[] = [];
    
    // Convert fields appropriately
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedUpdates: any = { ...updates };
    if ('tags' in updates) {
      mappedUpdates.tags = JSON.stringify(updates.tags || []);
    }
    ['isPublished', 'isUnlisted', 'isDraft'].forEach(field => {
      if (field in updates) {
        mappedUpdates[field] = updates[field] ? 1 : 0;
      }
    });
    
    mappedUpdates.updatedAt = new Date().toISOString();
    
    Object.entries(mappedUpdates).forEach(([key, val]) => {
      setStatements.push(`${key} = ?`);
      args.push(val);
    });
    
    if (setStatements.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }
    
    args.push(chatId);
    const updateQuery = `UPDATE chats SET ${setStatements.join(', ')} WHERE id = ?`;
    const result = await db.execute({
      sql: updateQuery,
      args
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Fetch the updated chat to return it
    const selectResult = await db.execute({
      sql: `SELECT * FROM chats WHERE id = ?`,
      args: [chatId]
    });
    const chat = mapRowToChat(selectResult.rows[0]);
    
    return NextResponse.json({ success: true, chat });
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
    
    await initDb();
    const result = await db.execute({
      sql: `DELETE FROM chats WHERE id = ?`,
      args: [chatId]
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}