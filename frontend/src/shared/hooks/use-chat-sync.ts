'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/shared/types/api';
import { messageKeys } from './use-messages';

interface ChatSyncMessage {
  type: 'NEW_MESSAGE' | 'TYPING_START' | 'TYPING_STOP';
  characterId: string;
  message?: Message;
  userId?: string;
  timestamp: number;
}

export function useChatSync(characterId: string) {
  const queryClient = useQueryClient();
  const channelRef = useRef<BroadcastChannel | null>(null);

  // BroadcastChannel 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      channelRef.current = new BroadcastChannel('chat-sync');
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [characterId]);

  // 메시지 브로드캐스트
  const broadcastMessage = useCallback((message: Message) => {
    if (!channelRef.current) return;

    const syncMessage: ChatSyncMessage = {
      type: 'NEW_MESSAGE',
      characterId,
      message,
      timestamp: Date.now(),
    };

    channelRef.current.postMessage(syncMessage);
  }, [characterId]);

  // 타이핑 상태 브로드캐스트
  const broadcastTyping = useCallback((isTyping: boolean, userId?: string) => {
    if (!channelRef.current) return;

    const syncMessage: ChatSyncMessage = {
      type: isTyping ? 'TYPING_START' : 'TYPING_STOP',
      characterId,
      userId,
      timestamp: Date.now(),
    };

    channelRef.current.postMessage(syncMessage);
  }, [characterId]);

  // 메시지 수신 처리
  useEffect(() => {
    if (!channelRef.current) return;

    const handleMessage = (event: MessageEvent<ChatSyncMessage>) => {
      const { type, characterId: messageCharacterId, message } = event.data;

      // 현재 캐릭터의 메시지만 처리
      if (messageCharacterId !== characterId) return;

      switch (type) {
        case 'NEW_MESSAGE':
          if (message) {
            const queryKey = messageKeys.conversation(characterId);
            
            // 중복 메시지 방지
            queryClient.setQueryData(queryKey, (old: { messages: Message[] } | undefined) => {
              if (!old) {
                return { messages: [message] };
              }
              
              const exists = old.messages.some(msg => msg.id === message.id);
              if (exists) return old;
              
              return { ...old, messages: [...old.messages, message] };
            });
          }
          break;

        case 'TYPING_START':
        case 'TYPING_STOP':
          // 타이핑 상태 업데이트 (추후 구현)
          break;
      }
    };

    channelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener('message', handleMessage);
      }
    };
  }, [characterId, queryClient]);

  return {
    broadcastMessage,
    broadcastTyping,
  };
}
