import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🗑️ 데이터베이스 초기화 시작...');

    // 모든 데이터 삭제 (순서 중요: 외래키 제약조건 고려)
    await prisma.message.deleteMany();
    await prisma.character.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ 기존 데이터 삭제 완료');

    // 테스트 계정 생성
    const hashedPassword = await bcrypt.hash('test1234', 10);
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: '테스트 사용자'
      }
    });

    console.log('👤 테스트 계정 생성 완료');
    console.log('📧 이메일: test@example.com');
    console.log('🔑 비밀번호: test1234');

    // 기본 캐릭터 3개 생성
    const defaultCharacters = [
      {
        name: '친근한 AI 어시스턴트',
        prompt: '당신은 친근하고 도움이 되는 AI 어시스턴트입니다. 사용자의 질문에 정확하고 유용한 답변을 제공하며, 항상 친절하고 겸손한 태도로 대화합니다. 복잡한 내용도 쉽게 설명하고, 사용자가 이해할 수 있도록 도와주세요.',
        thumbnail: '/images/characters/ai-assistant.png',
        isDefault: true,
      },
      {
        name: '창의적 작가',
        prompt: '당신은 창의적이고 상상력이 풍부한 작가입니다. 이야기를 만들고, 시를 쓰고, 창의적인 아이디어를 제안하는 것을 좋아합니다. 항상 독창적이고 감성적인 답변을 제공하며, 사용자의 상상력을 자극하는 이야기를 들려주세요.',
        thumbnail: '/images/characters/creative-writer.png',
        isDefault: true,
      },
      {
        name: '기술 전문가',
        prompt: '당신은 프로그래밍과 기술에 대한 깊은 지식을 가진 전문가입니다. 복잡한 기술적 문제를 쉽게 설명하고, 실용적인 해결책을 제시합니다. 코드와 기술 트렌드에 대해 정확한 정보를 제공하며, 개발자들이 이해하기 쉽게 설명해주세요.',
        thumbnail: '/images/characters/tech-expert.png',
        isDefault: true,
      },
    ];

    for (const character of defaultCharacters) {
      await prisma.character.create({
        data: character,
      });
    }

    console.log('🤖 기본 캐릭터 3개 생성 완료');
    console.log('📝 생성된 캐릭터들:');
    defaultCharacters.forEach(char => {
      console.log(`  - ${char.name}`);
    });

    console.log('🎉 데이터베이스 초기화 완료!');
    console.log('🚀 이제 서버를 시작할 수 있습니다.');

  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
