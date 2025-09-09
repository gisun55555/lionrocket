import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 모든 라우트는 인증 필요
router.use(authenticateToken);

// 메시지 전송
router.post('/send', MessageController.sendMessage);

// 모든 캐릭터의 대화 목록 조회
router.get('/conversations', MessageController.getAllConversations);

// 캐릭터별 대화 히스토리 조회
router.get('/conversations/:characterId', MessageController.getConversationHistory);

// 캐릭터별 대화 삭제
router.delete('/conversations/:characterId', MessageController.deleteConversation);

// 특정 메시지 삭제
router.delete('/:messageId', MessageController.deleteMessage);

export default router;
