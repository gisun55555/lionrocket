import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // 기존 테스트 계정 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('✅ 테스트 계정이 이미 존재합니다.');
      console.log('📧 이메일: test@example.com');
      console.log('🔑 비밀번호: test1234');
      return;
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash('test1234', 10);

    // 테스트 계정 생성
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: '테스트 사용자'
      }
    });

    console.log('🎉 테스트 계정이 생성되었습니다!');
    console.log('📧 이메일: test@example.com');
    console.log('🔑 비밀번호: test1234');
    console.log('👤 사용자 ID:', testUser.id);

  } catch (error) {
    console.error('❌ 테스트 계정 생성 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
