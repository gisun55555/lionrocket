import { z } from 'zod';

// 회원가입 검증 스키마
export const registerSchema = z.object({
  email: z
    .string()
    .email('유효한 이메일 주소를 입력해주세요')
    .min(1, '이메일을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(100, '비밀번호는 100자 이하여야 합니다'),
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 50자 이하여야 합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 사용 가능합니다'),
});

// 로그인 검증 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .email('유효한 이메일 주소를 입력해주세요')
    .min(1, '이메일을 입력해주세요'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요'),
});

// 검증 미들웨어 타입
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// 캐릭터 생성 검증 스키마
export const createCharacterSchema = z.object({
  name: z
    .string()
    .min(2, '캐릭터 이름은 최소 2자 이상이어야 합니다')
    .max(50, '캐릭터 이름은 50자 이하여야 합니다'),
  prompt: z
    .string()
    .min(10, '캐릭터 프롬프트는 최소 10자 이상이어야 합니다')
    .max(1000, '캐릭터 프롬프트는 1000자 이하여야 합니다'),
  thumbnail: z
    .string()
    .optional(), // URL 또는 파일 경로
});

// 캐릭터 수정 검증 스키마
export const updateCharacterSchema = z.object({
  name: z
    .string()
    .min(2, '캐릭터 이름은 최소 2자 이상이어야 합니다')
    .max(50, '캐릭터 이름은 50자 이하여야 합니다')
    .optional(),
  prompt: z
    .string()
    .min(10, '캐릭터 프롬프트는 최소 10자 이상이어야 합니다')
    .max(1000, '캐릭터 프롬프트는 1000자 이하여야 합니다')
    .optional(),
  thumbnail: z
    .string()
    .optional(), // URL 또는 파일 경로
});

// 응답 타입
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// 캐릭터 타입
export interface CharacterResponse {
  id: string;
  name: string;
  prompt: string;
  thumbnail?: string;
  isDefault: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

// 파일 업로드 검증
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'], {
    message: 'PNG, JPEG, WEBP, AVIF 파일만 업로드 가능합니다'
  }),
  size: z.number().max(5 * 1024 * 1024, '파일 크기는 5MB 이하여야 합니다'), // 5MB
  buffer: z.instanceof(Buffer),
});

// 메시지 전송 검증 스키마
export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, '메시지를 입력해주세요')
    .max(200, '메시지는 200자 이하여야 합니다')
    .trim(),
  characterId: z
    .string()
    .min(1, '캐릭터를 선택해주세요'),
});

// 메시지 응답 타입
export interface MessageResponse {
  id: string;
  content: string;
  isUser: boolean;
  userId: string;
  characterId: string;
  createdAt: string;
}

// 대화 히스토리 응답 타입
export interface ConversationResponse {
  characterId: string;
  characterName: string;
  messages: MessageResponse[];
  totalMessages: number;
}

// 검증 미들웨어 타입
export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;