"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const messageService_1 = require("../services/messageService");
const validation_1 = require("../lib/validation");
class MessageController {
    static async sendMessage(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const validatedData = validation_1.sendMessageSchema.parse(req.body);
            const result = await messageService_1.MessageService.sendMessage(validatedData, req.user.id);
            return res.status(201).json({
                success: true,
                message: '메시지가 전송되었습니다',
                data: result,
            });
        }
        catch (error) {
            console.error('메시지 전송 오류:', error);
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async getConversationHistory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const { characterId } = req.params;
            const { page = '1', limit = '50' } = req.query;
            if (!characterId) {
                return res.status(400).json({
                    success: false,
                    message: '캐릭터 ID가 필요합니다',
                });
            }
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                return res.status(400).json({
                    success: false,
                    message: '잘못된 페이지 정보입니다',
                });
            }
            const conversation = await messageService_1.MessageService.getConversationHistory(characterId, req.user.id, pageNum, limitNum);
            return res.json({
                success: true,
                data: conversation,
            });
        }
        catch (error) {
            console.error('대화 히스토리 조회 오류:', error);
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async getAllConversations(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const conversations = await messageService_1.MessageService.getAllConversations(req.user.id);
            return res.json({
                success: true,
                data: conversations,
            });
        }
        catch (error) {
            console.error('대화 목록 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async deleteConversation(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const { characterId } = req.params;
            if (!characterId) {
                return res.status(400).json({
                    success: false,
                    message: '캐릭터 ID가 필요합니다',
                });
            }
            await messageService_1.MessageService.deleteConversation(characterId, req.user.id);
            return res.json({
                success: true,
                message: '대화가 삭제되었습니다',
            });
        }
        catch (error) {
            console.error('대화 삭제 오류:', error);
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async deleteMessage(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const { messageId } = req.params;
            if (!messageId) {
                return res.status(400).json({
                    success: false,
                    message: '메시지 ID가 필요합니다',
                });
            }
            await messageService_1.MessageService.deleteMessage(messageId, req.user.id);
            return res.json({
                success: true,
                message: '메시지가 삭제되었습니다',
            });
        }
        catch (error) {
            console.error('메시지 삭제 오류:', error);
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=messageController.js.map