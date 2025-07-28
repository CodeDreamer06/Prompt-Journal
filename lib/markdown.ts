export function parseConversation(content: string) {
  const messages: Array<{ type: 'user' | 'assistant'; content: string }> = [];
  
  // Split by message headers, but keep the headers for identification
  const parts = content.split(/(?=### (?:🧑‍💻 )?(?:User|🤖 Assistant))/);
  
  parts.forEach(part => {
    const trimmed = part.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('### 🧑‍💻 User') || trimmed.startsWith('### User')) {
      // Extract content after the header, preserving everything until next message
      const content = trimmed.replace(/^### (?:🧑‍💻 )?User\s*\n\n?/, '');
      // Remove trailing separator if it exists
      const cleanContent = content.replace(/\n\n---\s*$/, '');
      if (cleanContent.trim()) {
        messages.push({ type: 'user', content: cleanContent });
      }
    } else if (trimmed.startsWith('### 🤖 Assistant') || trimmed.startsWith('### Assistant')) {
      // Extract content after the header, preserving everything until next message
      const content = trimmed.replace(/^### (?:🤖 )?Assistant\s*\n\n?/, '');
      // Remove trailing separator if it exists
      const cleanContent = content.replace(/\n\n---\s*$/, '');
      if (cleanContent.trim()) {
        messages.push({ type: 'assistant', content: cleanContent });
      }
    }
  });
  
  return messages;
}

export function formatConversation(messages: Array<{ type: 'user' | 'assistant'; content: string }>): string {
  return messages.map(message => {
    const header = message.type === 'user' ? '### 🧑‍💻 User' : '### 🤖 Assistant';
    return `${header}\n\n${message.content}`;
  }).join('\n\n---\n\n');
}