import { apiClient } from '@/shared/lib/api-client';
import type {
  FileUploadResponse,
  ImagePreviewResponse,
} from '@/shared/types/api';

export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const response = await apiClient.uploadFile<FileUploadResponse>('/upload/image', formData);
    return response.data!;
  },

  previewImage: async (file: File) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const response = await apiClient.uploadFile<ImagePreviewResponse>('/upload/preview', formData);
    return response.data!;
  },

  deleteImage: async (filename: string) => {
    const response = await apiClient.fetchAuth('/upload/image', 'DELETE', { filename });
    return response.data;
  },

  // 클라이언트 사이드 이미지 미리보기 (로컬)
  createLocalPreview: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // 파일 크기 및 타입 검증
  validateImageFile: (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

    if (file.size > maxSize) {
      throw new Error('파일 크기는 5MB 이하여야 합니다');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('PNG, JPEG, WEBP, AVIF 파일만 업로드 가능합니다');
    }

    return true;
  },
} as const;
