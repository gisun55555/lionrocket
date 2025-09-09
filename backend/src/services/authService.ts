import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput, AuthResponse } from '../lib/validation';

export class AuthService {
  // 회원가입
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = data;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다');
    }

    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // JWT 토큰 생성
    const token = generateToken({
      uid: user.id,
      email: user.email,
    });

    return {
      token,
      user,
    };
  }

  // 로그인
  static async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // JWT 토큰 생성
    const token = generateToken({
      uid: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // 사용자 정보 조회
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }

    return user;
  }

  // 이메일 중복 확인
  static async checkEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }
}
