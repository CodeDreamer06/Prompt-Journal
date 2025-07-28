'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveChat } from '@/lib/api-storage';
import { LLMType } from '@/lib/types';
import AdminLayout from '../components/AdminLayout';
import ChatEditor from '../components/ChatEditor';

export default function CreateChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (data: {
    title: string;
    content: string;
    llm: LLMType;
    tags: string[];
    isPublished: boolean;
    slug: string;
  }) => {
    setIsLoading(true);
    
    try {
      const chatData = {
        ...data,
        isUnlisted: false,
        views: 0,
        readingTime: 1,
        isDraft: false
      };
      const newChat = await saveChat(chatData);
      if (newChat) {
        router.push('/admin');
      } else {
        alert('Failed to save chat. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save chat:', error);
      alert('Failed to save chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <AdminLayout title="Create New Chat">
      <ChatEditor
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}