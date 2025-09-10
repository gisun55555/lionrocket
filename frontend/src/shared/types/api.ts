export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

// 캐릭터 관련 타입
export interface Character {
  id: string;
  name: string;
  prompt: string;
  thumbnail?: string;
  isDefault: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterRequest {
  name: string;
  prompt: string;
  thumbnail?: string;
}

export interface UpdateCharacterRequest {
  name?: string;
  prompt?: string;
  thumbnail?: string;
}

// 메시지 관련 타입
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  userId?: string;
  characterId: string;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  characterId: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  aiMessage: Message;
}

export interface Conversation {
  characterId: string;
  characterName: string;
  messages: Message[];
  totalMessages: number;
}

// 파일 업로드 관련 타입
export interface FileUploadResponse {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
}

export interface ImagePreviewResponse {
  preview: string; // Base64 데이터
}


// 페이지네이션 타입
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 쿼리 파라미터 타입
export interface CheckEmailParams {
  email: string;
}

export interface CheckCharacterNameParams {
  name: string;
}

// 메시지 관련 타입
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  userId?: string;
  characterId: string;
  createdAt: string;
}

export interface Conversation {
  characterId: string;
  characterName: string;
  messages: Message[];
  totalMessages: number;
  lastMessageAt: string;
}

export interface SendMessageRequest {
  characterId: string;
  content: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  aiMessage: Message;
}
