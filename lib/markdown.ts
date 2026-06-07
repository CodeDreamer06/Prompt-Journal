export function parseConversation(content: string) {
  const messages: Array<{ type: 'user' | 'assistant'; content: string }> = [];
  
  // Split by message headers, using multiline to check start of line
  const parts = content.split(/(?=^#{2,3}\s*(?:🧑‍💻|🧑💻|🤖)?\s*(?:User|Assistant)\b)/m);
  
  parts.forEach(part => {
    const trimmed = part.trim();
    if (!trimmed) return;
    
    // Check if it's a user message or assistant message
    const isUser = /^#{2,3}\s*(?:🧑‍💻|🧑💻)?\s*User\b/i.test(trimmed);
    const isAssistant = /^#{2,3}\s*(?:🤖)?\s*Assistant\b/i.test(trimmed);
    
    if (isUser || isAssistant) {
      const type = isUser ? 'user' : 'assistant';
      // Remove the header line
      let cleanContent = trimmed.replace(/^#{2,3}\s*(?:🧑‍💻|🧑💻|🤖)?\s*(?:User|Assistant)\b[^\n]*/i, '').trim();
      // Remove trailing separator if it exists
      cleanContent = cleanContent.replace(/(?:\r?\n)*---\s*$/, '').trim();
      
      if (cleanContent) {
        messages.push({ type, content: cleanContent });
      }
    }
  });
  
  return messages;
}

export function formatConversation(messages: Array<{ type: 'user' | 'assistant'; content: string }>): string {
  return messages.map(message => {
    const header = message.type === 'user' ? '## 🧑💻 User' : '## 🤖 Assistant';
    return `${header}\n\n${message.content}`;
  }).join('\n\n---\n\n');
}