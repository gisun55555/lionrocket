'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { charactersApi } from '@/shared/apis';
import type { 
  Character, 
  CreateCharacterRequest, 
  UpdateCharacterRequest 
} from '@/shared/types/api';

// 쿼리 키
export const characterKeys = {
  all: ['characters'] as const,
  lists: () => [...characterKeys.all, 'list'] as const,
  list: (filters: string) => [...characterKeys.lists(), { filters }] as const,
  details: () => [...characterKeys.all, 'detail'] as const,
  detail: (id: string) => [...characterKeys.details(), id] as const,
  default: () => [...characterKeys.all, 'default'] as const,
  user: () => [...characterKeys.all, 'user'] as const,
};

// 기본 캐릭터 목록 조회 (재시도 적용 - 중요한 데이터)
export function useDefaultCharacters() {
  return useQuery({
    queryKey: characterKeys.default(),
    queryFn: charactersApi.getDefaultCharacters,
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    retry: 2, // 네트워크 에러 시 2번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

// 모든 캐릭터 목록 조회
export function useAllCharacters() {
  return useQuery({
    queryKey: characterKeys.list('all'),
    queryFn: charactersApi.getAllCharacters,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    retry: 1, // 가벼운 재시도
  });
}

// 사용자 캐릭터 목록 조회
export function useUserCharacters() {
  return useQuery({
    queryKey: characterKeys.user(),
    queryFn: charactersApi.getUserCharacters,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
}

// 특정 캐릭터 상세 조회
export function useCharacter(id: string) {
  return useQuery({
    queryKey: characterKeys.detail(id),
    queryFn: () => charactersApi.getCharacterById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
}

// 캐릭터 생성 mutation
export function useCreateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (character: CreateCharacterRequest) => 
      charactersApi.createCharacter(character),
    onSuccess: (newCharacter: Character) => {
      // 캐릭터 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: characterKeys.user() });
      
      // 새 캐릭터 상세 정보 캐시에 추가
      queryClient.setQueryData(
        characterKeys.detail(newCharacter.id), 
        newCharacter
      );
    },
    onError: (error) => {
      console.error('캐릭터 생성 실패:', error);
    },
  });
}

// 캐릭터 수정 mutation
export function useUpdateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: UpdateCharacterRequest; 
    }) => charactersApi.updateCharacter(id, data),
    onSuccess: (updatedCharacter: Character) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: characterKeys.user() });
      
      // 캐릭터 상세 정보 업데이트
      queryClient.setQueryData(
        characterKeys.detail(updatedCharacter.id), 
        updatedCharacter
      );
    },
    onError: (error) => {
      console.error('캐릭터 수정 실패:', error);
    },
  });
}

// 캐릭터 삭제 mutation
export function useDeleteCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => charactersApi.deleteCharacter(id),
    onSuccess: (_, deletedId: string) => {
      // 캐릭터 목록에서 제거
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: characterKeys.user() });
      
      // 캐릭터 상세 정보 캐시에서 제거
      queryClient.removeQueries({ queryKey: characterKeys.detail(deletedId) });
      
      // 관련 메시지들도 제거
      queryClient.removeQueries({ 
        queryKey: ['messages', 'conversations', deletedId] 
      });
    },
    onError: (error) => {
      console.error('캐릭터 삭제 실패:', error);
    },
  });
}

// 캐릭터 이름 중복 확인 (재시도 적용)
export function useCheckCharacterName() {
  return useMutation({
    mutationFn: (name: string) => charactersApi.checkCharacterName({ name }),
    retry: 1, // 1번만 재시도
    retryDelay: 1000,
  });
}
