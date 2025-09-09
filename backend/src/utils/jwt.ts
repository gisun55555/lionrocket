import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const generateToken = (payload: { uid: string; email: string }): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h', // 1시간 만료
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('유효하지 않은 토큰입니다');
  }
};

export const generateShortToken = (payload: { uid: string; email: string }): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m', // 15분 만료 (민감한 API용)
  });
};
