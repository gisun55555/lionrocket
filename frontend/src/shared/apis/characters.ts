import { apiClient } from '@/shared/lib/api-client';
import type {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CheckCharacterNameParams,
} from '@/shared/types/api';

export const charactersApi = {
  getDefaultCharacters: async () => {
    const response = await apiClient.fetchNoAuth<Character[]>('/characters/default');
    return response.data!;
  },

  getAllCharacters: async () => {
    const response = await apiClient.fetchNoAuth<Character[]>('/characters');
    return response.data!;
  },

  getUserCharacters: async () => {
    const response = await apiClient.fetchAuth<Character[]>('/characters/user');
    return response.data!;
  },

  getCharacterById: async (id: string) => {
    const response = await apiClient.fetchNoAuth<Character>(`/characters/${id}`);
    return response.data!;
  },

  createCharacter: async (data: CreateCharacterRequest) => {
    const response = await apiClient.fetchAuth<Character>('/characters', 'POST', data);
    return response.data!;
  },

  updateCharacter: async (id: string, data: UpdateCharacterRequest) => {
    const response = await apiClient.fetchAuth<Character>(`/characters/${id}`, 'PUT', data);
    return response.data!;
  },

  deleteCharacter: async (id: string) => {
    const response = await apiClient.fetchAuth(`/characters/${id}`, 'DELETE');
    return response.data;
  },

  checkCharacterName: async (params: CheckCharacterNameParams) => {
    const response = await apiClient.fetchAuth<{ exists: boolean; message: string }>(
      `/characters/check-name?name=${encodeURIComponent(params.name)}`
    );
    return response.data!;
  },
} as const;
