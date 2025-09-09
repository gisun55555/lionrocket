export declare class ClaudeService {
    private static client;
    static generateResponse(userMessage: string, characterPrompt: string, conversationHistory?: {
        role: 'user' | 'assistant';
        content: string;
    }[]): Promise<string>;
    static validateApiKey(): Promise<boolean>;
}
//# sourceMappingURL=claudeService.d.ts.map