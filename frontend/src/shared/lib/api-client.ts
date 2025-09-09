import { ApiResponse } from '@/shared/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// 토큰 관리
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }

  // 모든 인증 관련 데이터 정리
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // 토큰 제거
      this.removeToken();
      
      // 다른 인증 관련 데이터가 있다면 여기서 정리
      // 예시: localStorage.removeItem('user_preferences');
      // 예시: localStorage.removeItem('app_settings');
      
    } catch (error) {
      console.warn('TokenManager 정리 중 에러:', error);
    }
  }
}

// fetch 설정 타입
interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  requireAuth?: boolean;
}

// 간단한 에러 클래스
export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// 메인 API 클라이언트 클래스
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // 기본 fetch 래퍼
  private async request<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      body,
      requireAuth = false,
      headers = {},
      ...fetchOptions
    } = options;

    // URL 구성
    const url = `${this.baseURL}${endpoint}`;

    // 헤더 구성
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 사용자 헤더 추가
    if (headers && typeof headers === 'object') {
      Object.assign(requestHeaders, headers);
    }

    // 인증 토큰 추가
    if (requireAuth) {
      const token = TokenManager.getToken();
      if (!token) {
        throw new ApiError('인증 토큰이 없습니다', 401);
      }
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    // 요청 설정
    const config: RequestInit = {
      ...fetchOptions,
      headers: requestHeaders,
    };

    // body가 FormData가 아닌 경우에만 JSON으로 변환
    if (body && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      // FormData의 경우 Content-Type 헤더 제거 (브라우저가 자동 설정)
      delete requestHeaders['Content-Type'];
      config.body = body;
    }

    try {
      const response = await fetch(url, config);
      
      // 응답 처리
      let data: ApiResponse<T>;
      
      try {
        data = await response.json();
      } catch {
        throw new ApiError(
          '서버 응답을 파싱할 수 없습니다',
          response.status
        );
      }

      // 에러 응답 처리
      if (!response.ok || !data.success) {
        if (response.status === 401) {
          // 인증 실패 시 모든 데이터 정리
          TokenManager.clearAll();
          
          // 메인 페이지로 리다이렉트 (클라이언트 사이드에서만)
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          }
        }
        throw new ApiError(data.message || '요청에 실패했습니다', response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('네트워크 연결을 확인해주세요', 0);
    }
  }

  // 인증 불필요한 요청들
  async fetchNoAuth<T = unknown>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: unknown) {
    return this.request<T>(endpoint, { method, body, requireAuth: false });
  }

  // 인증 필요한 요청들
  async fetchAuth<T = unknown>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: unknown) {
    return this.request<T>(endpoint, { method, body, requireAuth: true });
  }

  // 파일 업로드 (항상 인증 필요)
  async uploadFile<T = unknown>(endpoint: string, formData: FormData) {
    return this.request<T>(endpoint, { 
      method: 'POST', 
      body: formData, 
      requireAuth: true 
    });
  }
}

export const apiClient = new ApiClient();
export { TokenManager };
