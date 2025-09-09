import Anthropic from '@anthropic-ai/sdk';

export class ClaudeService {
  private static client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  // AI 응답 생성
  static async generateResponse(
    userMessage: string,
    characterPrompt: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<string> {
    try {
      // 캐릭터 프롬프트를 시스템 메시지로 설정
      const systemPrompt = `${characterPrompt}

규칙:
- 항상 캐릭터의 설정에 맞게 응답하세요
- 사용자와 자연스럽고 흥미로운 대화를 나누세요
- 응답은 200자 이내로 간결하게 작성하세요
- 한국어로 응답하세요`;

      // 대화 히스토리 포맷팅 (최근 10개만 사용)
      const recentHistory = conversationHistory.slice(-10);
      
      // 메시지 구성
      const messages: Anthropic.MessageParam[] = [
        ...recentHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // 빠르고 저렴한 모델
        max_tokens: 300,
        system: systemPrompt,
        messages: messages,
      });

      // 응답 텍스트 추출
      const content = response.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }

      throw new Error('AI 응답을 생성할 수 없습니다');
    } catch (error) {
      console.error('Claude API 오류:', error);
      
      if (error instanceof Anthropic.APIError) {
        if (error.status === 401) {
          throw new Error('Claude API 키가 올바르지 않습니다');
        } else if (error.status === 429) {
          throw new Error('AI 서비스 사용량 한도에 도달했습니다. 잠시 후 다시 시도해주세요');
        } else if (error.status === 400) {
          throw new Error('잘못된 요청입니다. 메시지를 다시 확인해주세요');
        }
      }
      
      throw new Error('AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요');
    }
  }

  // API 키 유효성 검사
  static async validateApiKey(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
