'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { loadAllChats, updateChat } from '@/lib/api-storage';
import { LLMType, Chat } from '@/lib/types';
import AdminLayout from '../../components/AdminLayout';
import ChatEditor from '../../components/ChatEditor';

interface EditChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditChatPage({ params }: EditChatPageProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const loadParams = async () => {
      const { id } = await params;
      setChatId(id);
      setMounted(true);
      
      const allChats = await loadAllChats();
      const loadedChat = allChats.find(chat => chat.id === id);
      if (!loadedChat) {
        notFound();
      }
      setChat(loadedChat);
    };
    
    loadParams();
  }, [params]);

  const handleSave = async (data: {
    title: string;
    content: string;
    llm: LLMType;
    tags: string[];
    isPublished: boolean;
    slug: string;
  }) => {
    if (!chat) return;
    
    setIsLoading(true);
    
    try {
      const updatedChat = await updateChat(chat.id, data);
      if (updatedChat) {
        router.push('/admin');
      } else {
        alert('Failed to update chat. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update chat:', error);
      alert('Failed to update chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  if (!mounted || !chat) {
    return (
      <AdminLayout title="Edit Chat">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${chat.title}`}>
      <ChatEditor
        initialData={{
          title: chat.title,
          content: chat.content,
          llm: chat.llm,
          tags: chat.tags,
          isPublished: chat.isPublished
        }}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}