import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET() {
  try {
    console.log('Testing Redis connection...');
    
    const redis = createClient({
      url: process.env.REDIS_URL
    });
    
    await redis.connect();
    
    // Test basic Redis operations
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    await redis.del('test-key');
    
    await redis.disconnect();
    
    console.log('Redis test successful, value:', value);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Redis connection working',
      testValue: value,
      env: {
        hasRedisUrl: !!process.env.REDIS_URL,
        hasAdminPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      }
    });
  } catch (error) {
    console.error('Redis test failed:', error);
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