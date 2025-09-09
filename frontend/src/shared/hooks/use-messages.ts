'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/shared/apis';
import type { SendMessageRequest, Message, Conversation } from '@/shared/types/api';

// 쿼리 키
export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (characterId: string) => 
    [...messageKeys.conversations(), characterId] as const,
  list: () => [...messageKeys.all, 'list'] as const,
};

// 특정 캐릭터와의 대화 히스토리 조회 (재시도 적용)
export function useConversation(characterId: string) {
  return useQuery({
    queryKey: messageKeys.conversation(characterId),
    queryFn: () => messagesApi.getConversationHistory(characterId),
    enabled: !!characterId,
    staleTime: 1000 * 60 * 2, // 2분간 fresh 상태 유지
    refetchOnWindowFocus: false, // 창 포커스 시 자동 새로고침 비활성화
    retry: 2, // 대화 기록은 중요하므로 2번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });
}

// 모든 대화 목록 조회
export function useConversations() {
  return useQuery({
    queryKey: messageKeys.list(),
    queryFn: messagesApi.getAllConversations,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    retry: 1, // 가벼운 재시도
  });
}

// 메시지 전송 mutation
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: SendMessageRequest) => messagesApi.sendMessage(message),
    onMutate: async (newMessage: SendMessageRequest) => {
      // 낙관적 업데이트를 위한 이전 데이터 백업
      const queryKey = messageKeys.conversation(newMessage.characterId);
      await queryClient.cancelQueries({ queryKey });

      const previousConversation = queryClient.getQueryData<Conversation>(queryKey);

      // 사용자 메시지 즉시 추가
      if (previousConversation) {
        const optimisticUserMessage: Message = {
          id: `temp-${Date.now()}`,
          content: newMessage.content,
          isUser: true,
          userId: 'current-user', // 임시 ID
          characterId: newMessage.characterId,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Conversation>(queryKey, {
          ...previousConversation,
          messages: [...previousConversation.messages, optimisticUserMessage],
          totalMessages: previousConversation.totalMessages + 1,
        });
      }

      return { previousConversation, queryKey };
    },
    onSuccess: (data, variables, context) => {
      // 실제 응답으로 대화 히스토리 업데이트
      if (context?.queryKey) {
        const previousConversation = context.previousConversation;
        if (previousConversation) {
          queryClient.setQueryData<Conversation>(context.queryKey, {
            ...previousConversation,
            messages: [
              ...previousConversation.messages.filter(msg => !msg.id.startsWith('temp-')),
              data.userMessage,
              data.aiMessage,
            ],
            totalMessages: previousConversation.totalMessages + 1,
          });
        }
      }
      
      // 대화 목록도 업데이트
      queryClient.invalidateQueries({ queryKey: messageKeys.list() });
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousConversation && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousConversation);
      }
      console.error('메시지 전송 실패:', error);
    },
  });
}

// 대화 삭제 mutation
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (characterId: string) => 
      messagesApi.deleteConversation(characterId),
    onSuccess: (_, characterId: string) => {
      // 특정 캐릭터 대화 캐시 제거
      queryClient.removeQueries({ 
        queryKey: messageKeys.conversation(characterId) 
      });
      
      // 대화 목록 새로고침
      queryClient.invalidateQueries({ queryKey: messageKeys.list() });
    },
    onError: (error) => {
      console.error('대화 삭제 실패:', error);
    },
  });
}

// 특정 메시지 삭제 mutation
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messagesApi.deleteMessage(messageId),
    onSuccess: () => {
      // 모든 대화 캐시 무효화 (어떤 대화에서 삭제되었는지 모르므로)
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messageKeys.list() });
    },
    onError: (error) => {
      console.error('메시지 삭제 실패:', error);
    },
  });
}

// 대화 히스토리 새로고침 유틸리티
export function useRefreshConversation(characterId: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ 
      queryKey: messageKeys.conversation(characterId) 
    });
  };
}
