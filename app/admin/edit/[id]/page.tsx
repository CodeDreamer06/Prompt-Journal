'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getChatById, updateChat } from '@/lib/storage';
import { LLMType, Chat } from '@/lib/types';
import AdminLayout from '../../components/AdminLayout';
import ChatEditor from '../../components/ChatEditor';

interface EditChatPageProps {
  params: {
    id: string;
  };
}

export default function EditChatPage({ params }: EditChatPageProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const loadedChat = getChatById(params.id);
    if (!loadedChat) {
      notFound();
    }
    setChat(loadedChat);
  }, [params.id]);

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
      updateChat(chat.id, data);
      router.push('/admin');
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