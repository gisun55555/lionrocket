import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 공개 라우트 (인증 불필요)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/check-email', AuthController.checkEmail);

// 보호된 라우트 (인증 필요)
router.get('/me', authenticateToken, AuthController.getMe);

export default router;
