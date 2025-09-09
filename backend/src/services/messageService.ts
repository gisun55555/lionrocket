import { prisma } from '../lib/prisma';
import { ClaudeService } from './claudeService';
import { SendMessageInput, MessageResponse, ConversationResponse } from '../lib/validation';

export class MessageService {
  // 메시지 전송 및 AI 응답 생성
  static async sendMessage(
    data: SendMessageInput,
    userId: string
  ): Promise<{ userMessage: MessageResponse; aiMessage: MessageResponse }> {
    const { content, characterId } = data;

    // 캐릭터 존재 확인 및 프롬프트 가져오기
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('캐릭터를 찾을 수 없습니다');
    }

    // 사용자 메시지 저장
    const userMessage = await prisma.message.create({
      data: {
        content: content,
        isUser: true,
        userId: userId,
        characterId: characterId,
      },
    });

    try {
      // 캐릭터별 대화 히스토리 가져오기 (최근 20개)
      const recentMessages = await prisma.message.findMany({
        where: {
          userId: userId,
          characterId: characterId,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // 대화 히스토리 포맷팅 (시간순 정렬)
      const conversationHistory = recentMessages
        .reverse()
        .slice(0, -1) // 방금 저장한 메시지 제외
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.content,
        }));

      // AI 응답 생성
      const aiResponse = await ClaudeService.generateResponse(
        content,
        character.prompt,
        conversationHistory
      );

      // AI 응답 저장
      const aiMessage = await prisma.message.create({
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
    } catch (error) {
      // AI 응답 생성 실패 시 오류 메시지 저장
      const errorMessage = await prisma.message.create({
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

  // 캐릭터별 대화 히스토리 조회
  static async getConversationHistory(
    characterId: string,
    userId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ConversationResponse> {
    // 캐릭터 정보 가져오기
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error('캐릭터를 찾을 수 없습니다');
    }

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 메시지 조회
    const messages = await prisma.message.findMany({
      where: {
        userId: userId,
        characterId: characterId,
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit,
    });

    // 총 메시지 수 조회
    const totalMessages = await prisma.message.count({
      where: {
        userId: userId,
        characterId: characterId,
      },
    });

    return {
      characterId: character.id,
      characterName: character.name,
      messages: messages.reverse().map(this.formatMessage), // 시간순 정렬
      totalMessages: totalMessages,
    };
  }

  // 모든 캐릭터의 최근 대화 조회
  static async getAllConversations(userId: string): Promise<ConversationResponse[]> {
    // 사용자가 대화한 캐릭터들 조회
    const charactersWithMessages = await prisma.character.findMany({
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
          take: 1, // 최근 메시지 1개만
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
          _count: 'desc', // 메시지가 많은 순서로
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

  // 캐릭터별 대화 삭제
  static async deleteConversation(characterId: string, userId: string): Promise<void> {
    await prisma.message.deleteMany({
      where: {
        userId: userId,
        characterId: characterId,
      },
    });
  }

  // 특정 메시지 삭제
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error('메시지를 찾을 수 없습니다');
    }

    if (message.userId !== userId) {
      throw new Error('메시지를 삭제할 권한이 없습니다');
    }

    await prisma.message.delete({
      where: { id: messageId },
    });
  }

  // 메시지 포맷팅 헬퍼
  private static formatMessage(message: any): MessageResponse {
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
