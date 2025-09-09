import { SendMessageInput, MessageResponse, ConversationResponse } from '../lib/validation';
export declare class MessageService {
    static sendMessage(data: SendMessageInput, userId: string): Promise<{
        userMessage: MessageResponse;
        aiMessage: MessageResponse;
    }>;
    static getConversationHistory(characterId: string, userId: string, page?: number, limit?: number): Promise<ConversationResponse>;
    static getAllConversations(userId: string): Promise<ConversationResponse[]>;
    static deleteConversation(characterId: string, userId: string): Promise<void>;
    static deleteMessage(messageId: string, userId: string): Promise<void>;
    private static formatMessage;
}
//# sourceMappingURL=messageService.d.ts.map