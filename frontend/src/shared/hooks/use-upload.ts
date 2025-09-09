'use client';

import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '@/shared/apis';

// 이미지 업로드 mutation
export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
    retry: (failureCount, error) => {
      // 400은 재시도 하지 않음 (잘못된 파일 형식)
      if (error instanceof Error && 'status' in error) {
        const status = (error as Error & { status: number }).status;
        if (status === 400) return false;
      }
      // 네트워크 에러는 최대 2번 재시도
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    onError: (error) => {
      console.error('이미지 업로드 실패:', error);
    },
  });
}

// 이미지 미리보기 생성 mutation
export function usePreviewImage() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.previewImage(file),
    retry: false, // 미리보기는 재시도 하지 않음
    onError: (error) => {
      console.error('이미지 미리보기 실패:', error);
    },
  });
}

// 이미지 삭제 mutation
export function useDeleteImage() {
  return useMutation({
    mutationFn: (filePath: string) => uploadApi.deleteImage(filePath),
    retry: (failureCount, error) => {
      // 404는 재시도 하지 않음 (이미 삭제됨)
      if (error instanceof Error && 'status' in error) {
        const status = (error as Error & { status: number }).status;
        if (status === 404) return false;
      }
      return failureCount < 1;
    },
    onError: (error) => {
      console.error('이미지 삭제 실패:', error);
    },
  });
}

// 로컬 미리보기 생성 유틸리티 (즉시 실행)
export function useLocalPreview() {
  return {
    createPreview: (file: File) => uploadApi.createLocalPreview(file),
    revokePreview: (url: string) => URL.revokeObjectURL(url),
  };
}