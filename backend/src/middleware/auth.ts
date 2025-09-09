import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../types/auth';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다' });
    }

    // JWT 토큰 검증
    const decoded = verifyToken(token);
    
    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ 
      message: '유효하지 않은 토큰입니다',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 선택적 인증 (토큰이 있으면 검증, 없어도 통과)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // 토큰이 없어도 통과
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 통과 (선택적 인증)
    next();
  }
};
