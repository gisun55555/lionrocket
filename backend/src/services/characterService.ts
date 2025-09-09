import { prisma } from '../lib/prisma';
import { CreateCharacterInput, UpdateCharacterInput, CharacterResponse } from '../lib/validation';

export class CharacterService {
  // 모든 캐릭터 조회 (기본 + 사용자 캐릭터)
  static async getAllCharacters(userId?: string): Promise<CharacterResponse[]> {
    const characters = await prisma.character.findMany({
      where: {
        OR: [
          { isDefault: true }, // 기본 캐릭터
          { userId: userId },  // 사용자 캐릭터
        ],
      },
      orderBy: [
        { isDefault: 'desc' }, // 기본 캐릭터 먼저
        { createdAt: 'desc' }, // 최신순
      ],
    });

    return characters.map(char => ({
      id: char.id,
      name: char.name,
      prompt: char.prompt,
      thumbnail: char.thumbnail || undefined,
      isDefault: char.isDefault,
      userId: char.userId || undefined,
      createdAt: char.createdAt.toISOString(),
      updatedAt: char.updatedAt.toISOString(),
    }));
  }

  // 기본 캐릭터만 조회
  static async getDefaultCharacters(): Promise<CharacterResponse[]> {
    const characters = await prisma.character.findMany({
      where: { isDefault: true },
      orderBy: { createdAt: 'asc' },
    });

    return characters.map(char => ({
      id: char.id,
      name: char.name,
      prompt: char.prompt,
      thumbnail: char.thumbnail || undefined,
      isDefault: char.isDefault,
      userId: char.userId || undefined,
      createdAt: char.createdAt.toISOString(),
      updatedAt: char.updatedAt.toISOString(),
    }));
  }

  // 사용자 캐릭터만 조회
  static async getUserCharacters(userId: string): Promise<CharacterResponse[]> {
    const characters = await prisma.character.findMany({
      where: { 
        userId: userId,
        isDefault: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return characters.map(char => ({
      id: char.id,
      name: char.name,
      prompt: char.prompt,
      thumbnail: char.thumbnail || undefined,
      isDefault: char.isDefault,
      userId: char.userId || undefined,
      createdAt: char.createdAt.toISOString(),
      updatedAt: char.updatedAt.toISOString(),
    }));
  }

  // 캐릭터 ID로 조회
  static async getCharacterById(characterId: string): Promise<CharacterResponse | null> {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      return null;
    }

    return {
      id: character.id,
      name: character.name,
      prompt: character.prompt,
      thumbnail: character.thumbnail || undefined,
      isDefault: character.isDefault,
      userId: character.userId || undefined,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
    };
  }

  // 캐릭터 생성
  static async createCharacter(data: CreateCharacterInput, userId: string): Promise<CharacterResponse> {
    const character = await prisma.character.create({
      data: {
        name: data.name,
        prompt: data.prompt,
        thumbnail: data.thumbnail,
        isDefault: false,
        userId: userId,
      },
    });

    return {
      id: character.id,
      name: character.name,
      prompt: character.prompt,
      thumbnail: character.thumbnail || undefined,
      isDefault: character.isDefault,
      userId: character.userId || undefined,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
    };
  }

  // 캐릭터 수정
  static async updateCharacter(
    characterId: string, 
    data: UpdateCharacterInput, 
    userId: string
  ): Promise<CharacterResponse> {
    // 캐릭터 존재 및 소유권 확인
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!existingCharacter) {
      throw new Error('캐릭터를 찾을 수 없습니다');
    }

    if (existingCharacter.isDefault) {
      throw new Error('기본 캐릭터는 수정할 수 없습니다');
    }

    if (existingCharacter.userId !== userId) {
      throw new Error('캐릭터를 수정할 권한이 없습니다');
    }

    const character = await prisma.character.update({
      where: { id: characterId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.prompt && { prompt: data.prompt }),
        ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      },
    });

    return {
      id: character.id,
      name: character.name,
      prompt: character.prompt,
      thumbnail: character.thumbnail || undefined,
      isDefault: character.isDefault,
      userId: character.userId || undefined,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
    };
  }

  // 캐릭터 삭제
  static async deleteCharacter(characterId: string, userId: string): Promise<void> {
    // 캐릭터 존재 및 소유권 확인
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!existingCharacter) {
      throw new Error('캐릭터를 찾을 수 없습니다');
    }

    if (existingCharacter.isDefault) {
      throw new Error('기본 캐릭터는 삭제할 수 없습니다');
    }

    if (existingCharacter.userId !== userId) {
      throw new Error('캐릭터를 삭제할 권한이 없습니다');
    }

    await prisma.character.delete({
      where: { id: characterId },
    });
  }

  // 캐릭터 이름 중복 확인
  static async checkNameExists(name: string, userId: string, excludeId?: string): Promise<boolean> {
    const character = await prisma.character.findFirst({
      where: {
        name: name,
        userId: userId,
        isDefault: false,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return !!character;
  }
}
