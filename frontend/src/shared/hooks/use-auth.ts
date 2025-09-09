'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, TokenManager } from '@/shared/apis';
import type { LoginRequest, AuthResponse } from '@/shared/types/api';

// 쿼리 키
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// 현재 사용자 정보 조회
export function useAuth() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getMe,
    enabled: !!TokenManager.getToken(), // 토큰이 있을 때만 실행
    retry: false, // 401 에러 시 재시도 하지 않음
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
  });
}

// 로그인 mutation (재시도 로직 적용)
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    retry: (failureCount, error) => {
      // 401, 400은 재시도 하지 않음 (잘못된 인증 정보)
      if (error instanceof Error && 'status' in error) {
        const status = (error as Error & { status: number }).status;
        if (status === 401 || status === 400) return false;
      }
      // 네트워크 에러는 최대 2번 재시도
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // 1초, 2초, 3초
    onSuccess: (data: AuthResponse) => {
      // 토큰 저장
      TokenManager.setToken(data.token);
      
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(authKeys.user(), data.user);
      
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
    },
  });
}

// 로그아웃 mutation (재시도 필요 없음)
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    retry: false, // 로그아웃은 재시도 하지 않음
    onSuccess: () => {
      // 로그아웃 성공 시 모든 데이터 정리
      cleanupAuthData(queryClient);
    },
    onError: (error) => {
      // 에러가 있어도 로컬 데이터는 정리
      cleanupAuthData(queryClient);
      console.error('로그아웃 에러:', error);
    },
  });
}

// 로그아웃 시 모든 인증 관련 데이터 정리 함수
function cleanupAuthData(queryClient: ReturnType<typeof useQueryClient>) {
  // 1. 모든 인증 관련 로컬스토리지 데이터 정리
  TokenManager.clearAll();
  
  // 2. 모든 쿼리 캐시 클리어
  queryClient.clear();
  
  // 3. 특정 쿼리들만 무효화하는 경우 (옵션)
  // queryClient.removeQueries({ queryKey: ['auth'] });
  // queryClient.removeQueries({ queryKey: ['characters'] });
  // queryClient.removeQueries({ queryKey: ['messages'] });
  
  console.log('✅ 로그아웃 데이터 정리 완료');
}

// 인증 상태 확인 (단순한 boolean 반환)
export function useIsAuthenticated() {
  const { data: user, isLoading } = useAuth();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

// 이메일 중복 확인 (재시도 로직 적용)
export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => authApi.checkEmail({ email }),
    retry: (failureCount, error) => {
      // 400 에러는 재시도 하지 않음 (잘못된 이메일 형식)
      if (error instanceof Error && 'status' in error) {
        const status = (error as Error & { status: number }).status;
        if (status === 400) return false;
      }
      // 네트워크 에러는 최대 1번 재시도
      return failureCount < 1;
    },
    retryDelay: 1000, // 1초 후 재시도
  });
}

// 회원가입 mutation (재시도 로직 적용)
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    retry: (failureCount, error) => {
      // 400, 409는 재시도 하지 않음 (잘못된 데이터, 중복 이메일)
      if (error instanceof Error && 'status' in error) {
        const status = (error as Error & { status: number }).status;
        if (status === 400 || status === 409) return false;
      }
      // 네트워크 에러는 최대 2번 재시도
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    onSuccess: (data: AuthResponse) => {
      // 토큰 저장
      TokenManager.setToken(data.token);
      
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
    },
  });
}
