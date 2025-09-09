"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const prisma_1 = require("../lib/prisma");
const claudeService_1 = require("./claudeService");
class MessageService {
    static async sendMessage(data, userId) {
        const { content, characterId } = data;
        const character = await prisma_1.prisma.character.findUnique({
            where: { id: characterId },
        });
        if (!character) {
            throw new Error('캐릭터를 찾을 수 없습니다');
        }
        const userMessage = await prisma_1.prisma.message.create({
            data: {
                content: content,
                isUser: true,
                userId: userId,
                characterId: characterId,
            },
        });
        try {
            const recentMessages = await prisma_1.prisma.message.findMany({
                where: {
                    userId: userId,
                    characterId: characterId,
                },
                orderBy: { createdAt: 'desc' },
                take: 20,
            });
            const conversationHistory = recentMessages
                .reverse()
                .slice(0, -1)
                .map(msg => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.content,
            }));
            const aiResponse = await claudeService_1.ClaudeService.generateResponse(content, character.prompt, conversationHistory);
            const aiMessage = await prisma_1.prisma.message.create({
                data: {
                    content: aiResponse,
                    isUser: false,
                    userId: userId,
                    characterId: characterId,
                },
            });
            return {
                userMessage: this.formatMessage(userMessage),
                aiMessage: this.formatMessage(aiMessage),
            };
        }
        catch (error) {
            const errorMessage = await prisma_1.prisma.message.create({
                data: {
                    content: error instanceof Error ? error.message : 'AI 응답을 생성할 수 없습니다.',
                    isUser: false,
                    userId: userId,
                    characterId: characterId,
                },
            });
            return {
                userMessage: this.formatMessage(userMessage),
                aiMessage: this.formatMessage(errorMessage),
            };
        }
    }
    static async getConversationHistory(characterId, userId, page = 1, limit = 50) {
        const character = await prisma_1.prisma.character.findUnique({
            where: { id: characterId },
        });
        if (!character) {
            throw new Error('캐릭터를 찾을 수 없습니다');
        }
        const skip = (page - 1) * limit;
        const messages = await prisma_1.prisma.message.findMany({
            where: {
                userId: userId,
                characterId: characterId,
            },
            orderBy: { createdAt: 'desc' },
            skip: skip,
            take: limit,
        });
        const totalMessages = await prisma_1.prisma.message.count({
            where: {
                userId: userId,
                characterId: characterId,
            },
        });
        return {
            characterId: character.id,
            characterName: character.name,
            messages: messages.reverse().map(this.formatMessage),
            totalMessages: totalMessages,
        };
    }
    static async getAllConversations(userId) {
        const charactersWithMessages = await prisma_1.prisma.character.findMany({
            where: {
                messages: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                messages: {
                    where: {
                        userId: userId,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                userId: userId,
                            },
                        },
                    },
                },
            },
            orderBy: {
                messages: {
                    _count: 'desc',
                },
            },
        });
        return charactersWithMessages.map(character => ({
            characterId: character.id,
            characterName: character.name,
            messages: character.messages.map(this.formatMessage),
            totalMessages: character._count.messages,
        }));
    }
    static async deleteConversation(characterId, userId) {
        await prisma_1.prisma.message.deleteMany({
            where: {
                userId: userId,
                characterId: characterId,
            },
        });
    }
    static async deleteMessage(messageId, userId) {
        const message = await prisma_1.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new Error('메시지를 찾을 수 없습니다');
        }
        if (message.userId !== userId) {
            throw new Error('메시지를 삭제할 권한이 없습니다');
        }
        await prisma_1.prisma.message.delete({
            where: { id: messageId },
        });
    }
    static formatMessage(message) {
        return {
            id: message.id,
            content: message.content,
            isUser: message.isUser,
            userId: message.userId,
            characterId: message.characterId,
            createdAt: message.createdAt.toISOString(),
        };
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=messageService.js.map