import { apiClient } from '@/shared/lib/api-client';
import type {
  SendMessageRequest,
  SendMessageResponse,
  Conversation,
  PaginationParams,
} from '@/shared/types/api';

export const messagesApi = {
  sendMessage: async (data: SendMessageRequest) => {
    const response = await apiClient.fetchAuth<SendMessageResponse>('/messages/send', 'POST', data);
    return response.data!;
  },

  getConversationHistory: async (characterId: string, params: PaginationParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/messages/conversations/${characterId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.fetchAuth<Conversation>(endpoint);
    return response.data!;
  },

  getAllConversations: async () => {
    const response = await apiClient.fetchAuth<Conversation[]>('/messages/conversations');
    return response.data!;
  },

  deleteConversation: async (characterId: string) => {
    const response = await apiClient.fetchAuth(`/messages/conversations/${characterId}`, 'DELETE');
    return response.data;
  },

  deleteMessage: async (messageId: string) => {
    const response = await apiClient.fetchAuth(`/messages/${messageId}`, 'DELETE');
    return response.data;
  },
} as const;
