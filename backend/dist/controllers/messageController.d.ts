import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class MessageController {
    static sendMessage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConversationHistory(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllConversations(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteConversation(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteMessage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=messageController.d.ts.map