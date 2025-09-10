'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useCharacter, useConversation, useSendMessage, useChatSync } from '@/shared/hooks';
import { 
  ChatHeader, 
  MessageList, 
  MessageInput, 
  LoadingSkeleton, 
  ErrorState 
} from './section';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: character, isLoading: characterLoading } = useCharacter(characterId);
  const { data: conversation, isLoading: conversationLoading } = useConversation(characterId);
  const sendMessageMutation = useSendMessage();
  
  const { broadcastMessage, broadcastTyping } = useChatSync(characterId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;

    const messageContent = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        characterId,
        content: messageContent,
      });
      
      if (response.userMessage) {
        broadcastMessage(response.userMessage);
      }
      if (response.aiMessage) {
        broadcastMessage(response.aiMessage);
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    } finally {
      setIsTyping(false);
    }
  };


  useEffect(() => {
    if (isTyping) {
      broadcastTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        broadcastTyping(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      broadcastTyping(false);
    }
  }, [isTyping, broadcastTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (characterLoading || conversationLoading) {
    return <LoadingSkeleton />;
  }

  if (!character) {
    return <ErrorState onBack={() => router.push('/characters')} />;
  }

  const messages = conversation?.messages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <ChatHeader 
        character={character} 
        onBack={() => router.push('/characters')} 
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-140px)] shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 overflow-hidden">
              <MessageList 
                messages={messages}
                character={character}
                isTyping={isTyping}
              />
              <div ref={messagesEndRef} />
            </ScrollArea>

            <MessageInput
              message={message}
              onMessageChange={setMessage}
              onSubmit={handleSendMessage}
              isPending={sendMessageMutation.isPending}
              characterName={character.name}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
