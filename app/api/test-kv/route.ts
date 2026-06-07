import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing Turso connection...');
    await initDb();
    
    // Test basic query
    const result = await db.execute(`SELECT 1 + 1 as val`);
    const val = result.rows[0].val;
    
    console.log('Turso test successful, result:', val);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Turso connection working',
      testValue: Number(val),
      env: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
        hasAdminPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      }
    });
  } catch (error) {
    console.error('Turso test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
        hasAdminPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      }
    }, { status: 500 });
  }
}