'use client';

import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { Message, Character } from '@/shared/types/api';

interface MessageListProps {
  messages: Message[];
  character: Character;
  isTyping: boolean;
}

export function MessageList({ messages, character, isTyping }: MessageListProps) {
  return (
    <div className="space-y-4 min-h-full">
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
    </div>
  );
}
