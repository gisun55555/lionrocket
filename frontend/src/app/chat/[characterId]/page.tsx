'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { useCharacter, useConversation, useSendMessage, useChatSync } from '@/shared/hooks';
import type { Message } from '@/shared/types/api';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 데이터 페칭
  const { data: character, isLoading: characterLoading } = useCharacter(characterId);
  const { data: conversation, isLoading: conversationLoading } = useConversation(characterId);
  const sendMessageMutation = useSendMessage();
  
  // 채팅 동기화
  const { broadcastMessage, broadcastTyping } = useChatSync(characterId);

  // 메시지 전송 핸들러
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
      
      // 다른 탭에 메시지 동기화
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


  // 타이핑 상태 동기화
  useEffect(() => {
    if (isTyping) {
      broadcastTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        broadcastTyping(false);
      }, 3000); // 3초 후 자동으로 타이핑 상태 해제
      
      return () => clearTimeout(timer);
    } else {
      broadcastTyping(false);
    }
  }, [isTyping, broadcastTyping]);

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // 로딩 상태
  if (characterLoading || conversationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <p className="text-lg text-slate-600 dark:text-slate-400">채팅을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 캐릭터가 없는 경우
  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Bot className="h-16 w-16 mx-auto text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">캐릭터를 찾을 수 없습니다</h1>
          <p className="text-slate-600 dark:text-slate-400">존재하지 않는 캐릭터입니다.</p>
          <Button onClick={() => router.push('/characters')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            캐릭터 선택으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const messages = conversation?.messages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/characters')}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                뒤로가기
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-blue-500/20 dark:ring-blue-400/30 shadow-lg">
                  <AvatarImage src={character.thumbnail || undefined} alt={character.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {character.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {character.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      character.isDefault 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                      {character.isDefault ? '✨ 기본 캐릭터' : '👤 내 캐릭터'}
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">온라인</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-140px)] shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-0 h-full flex flex-col">
            {/* 메시지 목록 */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 overflow-hidden">
              <div className="space-y-4 min-h-full">
                {/* 첫 인사 메시지 */}
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      안녕하세요! {character.name}입니다
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      무엇을 도와드릴까요?
                    </p>
                  </div>
                )}

                {/* 메시지들 */}
                {messages.map((msg: Message, index: number) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isUser ? 'justify-start' : 'justify-end'} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {msg.isUser && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[70%] rounded-3xl px-5 py-4 shadow-lg ${
                        msg.isUser
                          ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600'
                          : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-blue-500/25'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium break-words">
                        {msg.content}
                      </p>
                      
                      <p className={`text-xs mt-3 ${
                        msg.isUser ? 'text-slate-500 dark:text-slate-400' : 'text-blue-100'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {!msg.isUser && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={character.thumbnail || undefined} alt={character.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                          {character.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* 타이핑 인디케이터 */}
                {isTyping && (
                  <div className="flex gap-3 justify-end">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-100 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-100 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-100 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={character.thumbnail || undefined} alt={character.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {character.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 메시지 입력 */}
            <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-6 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`${character.name}에게 메시지를 보내세요...`}
                    className="w-full h-12 pl-4 pr-12 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg transition-all duration-200"
                    maxLength={200}
                    disabled={sendMessageMutation.isPending}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
                    {message.length}/200
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
