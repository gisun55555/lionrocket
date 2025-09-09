import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../lib/validation';
import { AuthenticatedRequest } from '../types/auth';

export class AuthController {
  // 회원가입
  static async register(req: Request, res: Response) {
    try {
      // 입력 데이터 검증
      const validatedData = registerSchema.parse(req.body);

      // 회원가입 처리
      const result = await AuthService.register(validatedData);

      return res.status(201).json({
        success: true,
        message: '회원가입이 완료되었습니다',
        data: result,
      });
    } catch (error) {
      console.error('회원가입 오류:', error);

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 로그인
  static async login(req: Request, res: Response) {
    try {
      // 입력 데이터 검증
      const validatedData = loginSchema.parse(req.body);

      // 로그인 처리
      const result = await AuthService.login(validatedData);

      return res.json({
        success: true,
        message: '로그인되었습니다',
        data: result,
      });
    } catch (error) {
      console.error('로그인 오류:', error);

      if (error instanceof Error) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 로그아웃 (클라이언트 측에서 토큰 제거)
  static async logout(req: Request, res: Response) {
    return res.json({
      success: true,
      message: '로그아웃되었습니다',
    });
  }

  // 현재 사용자 정보 조회
  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      const user = await AuthService.getUserById(req.user.id);

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 이메일 중복 확인
  static async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: '이메일을 입력해주세요',
        });
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '유효한 이메일 형식이 아닙니다',
        });
      }

      const exists = await AuthService.checkEmailExists(email);

      return res.json({
        success: true,
        data: {
          email,
          available: !exists,
        },
      });
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }
}