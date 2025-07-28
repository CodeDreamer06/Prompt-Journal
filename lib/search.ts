import { Chat, SearchFilters } from './types';

export function searchChats(chats: Chat[], filters: SearchFilters): Chat[] {
  let filteredChats = [...chats];

  // Filter by publication status and unlisted status
  if (!filters.includeUnlisted) {
    filteredChats = filteredChats.filter(chat => 
      chat.isPublished && !chat.isUnlisted
    );
  } else {
    filteredChats = filteredChats.filter(chat => chat.isPublished);
  }

  // Full-text search
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    filteredChats = filteredChats.filter(chat => {
      const searchableText = [
        chat.title,
        chat.content,
        chat.excerpt || '',
        ...chat.tags
      ].join(' ').toLowerCase();
      
      return searchableText.includes(query);
    });
  }

  // Filter by LLM
  if (filters.llm) {
    filteredChats = filteredChats.filter(chat => chat.llm === filters.llm);
  }

  // Filter by tags
  if (filters.tags.length > 0) {
    filteredChats = filteredChats.filter(chat =>
      filters.tags.some(tag => chat.tags.includes(tag))
    );
  }

  return filteredChats;
}

export function getPopularChats(chats: Chat[], limit: number = 10): Chat[] {
  return chats
    .filter(chat => chat.isPublished && !chat.isUnlisted)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getAllTags(chats: Chat[]): string[] {
  const tagSet = new Set<string>();
  chats.forEach(chat => {
    chat.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}