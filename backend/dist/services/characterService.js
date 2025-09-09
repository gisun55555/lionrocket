"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterService = void 0;
const prisma_1 = require("../lib/prisma");
class CharacterService {
    static async getAllCharacters(userId) {
        const characters = await prisma_1.prisma.character.findMany({
            where: {
                OR: [
                    { isDefault: true },
                    { userId: userId },
                ],
            },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
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
    static async getDefaultCharacters() {
        const characters = await prisma_1.prisma.character.findMany({
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
    static async getUserCharacters(userId) {
        const characters = await prisma_1.prisma.character.findMany({
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
    static async getCharacterById(characterId) {
        const character = await prisma_1.prisma.character.findUnique({
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
    static async createCharacter(data, userId) {
        const character = await prisma_1.prisma.character.create({
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
    static async updateCharacter(characterId, data, userId) {
        const existingCharacter = await prisma_1.prisma.character.findUnique({
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
        const character = await prisma_1.prisma.character.update({
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
    static async deleteCharacter(characterId, userId) {
        const existingCharacter = await prisma_1.prisma.character.findUnique({
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
        await prisma_1.prisma.character.delete({
            where: { id: characterId },
        });
    }
    static async checkNameExists(name, userId, excludeId) {
        const character = await prisma_1.prisma.character.findFirst({
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
exports.CharacterService = CharacterService;
//# sourceMappingURL=characterService.js.map