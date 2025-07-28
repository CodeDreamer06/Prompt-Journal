import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    console.log('Testing KV connection...');
    
    // Test basic KV operations
    await kv.set('test-key', 'test-value');
    const value = await kv.get('test-key');
    await kv.del('test-key');
    
    console.log('KV test successful, value:', value);
    
    return NextResponse.json({ 
      success: true, 
      message: 'KV connection working',
      testValue: value,
      env: {
        hasRedisUrl: !!process.env.REDIS_URL,
        hasAdminPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      }
    });
  } catch (error) {
    console.error('KV test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasRedisUrl: !!process.env.REDIS_URL,
        hasAdminPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      }
    }, { status: 500 });
  }
}