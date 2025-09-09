import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCharacterThumbnails() {
  console.log('🖼️ 캐릭터 썸네일 업데이트 시작...');

  const thumbnailMap = {
    '친근한 AI 어시스턴트': '/images/characters/ai-assistant.png',
    '창의적 작가': '/images/characters/creative-writer.png',
    '기술 전문가': '/images/characters/tech-expert.png',
  };

  for (const [name, thumbnail] of Object.entries(thumbnailMap)) {
    const character = await prisma.character.findFirst({
      where: {
        name: name,
        isDefault: true,
      },
    });

    if (character) {
      await prisma.character.update({
        where: { id: character.id },
        data: { thumbnail },
      });
      console.log(`✅ ${name} 썸네일 업데이트 완료: ${thumbnail}`);
    } else {
      console.log(`❌ ${name} 캐릭터를 찾을 수 없습니다.`);
    }
  }

  console.log('🎉 모든 썸네일 업데이트 완료!');
}

updateCharacterThumbnails()
  .catch((e) => {
    console.error('❌ 썸네일 업데이트 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
