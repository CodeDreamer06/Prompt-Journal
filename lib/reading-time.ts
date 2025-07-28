// Calculate reading time for conversations
// Assumes faster than average reading speed for tech-savvy users

export function calculateReadingTime(content: string): number {
  // Remove markdown formatting for accurate word count
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks (they read faster)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Faster reading speed for tech users: 280 WPM (vs average 200-250)
  // Code and technical content is typically read slower, so we balance it out
  const wordsPerMinute = 280;
  
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  // Minimum 1 minute for any conversation
  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}