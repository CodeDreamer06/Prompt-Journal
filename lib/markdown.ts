export function parseConversation(content: string) {
  // Split by the separator pattern
  const parts = content.split(/\n\n---\n\n/);
  const messages: Array<{ type: 'user' | 'assistant'; content: string }> = [];
  
  parts.forEach(part => {
    const trimmed = part.trim();
    
    if (trimmed.startsWith('### 🧑‍💻 User') || trimmed.startsWith('### User')) {
      const content = trimmed.replace(/^### (?:🧑‍💻 )?User\s*\n\n/, '');
      messages.push({ type: 'user', content });
    } else if (trimmed.startsWith('### 🤖 Assistant') || trimmed.startsWith('### Assistant')) {
      const content = trimmed.replace(/^### (?:🤖 )?Assistant\s*\n\n/, '');
      messages.push({ type: 'assistant', content });
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