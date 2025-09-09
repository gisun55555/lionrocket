import { Router } from 'express';
import { CharacterController } from '../controllers/characterController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// 공개 라우트 (인증 불필요)
router.get('/default', CharacterController.getDefaultCharacters);

// 보호된 라우트 (인증 필요)
router.get('/', optionalAuth, CharacterController.getAllCharacters);
router.get('/user', authenticateToken, CharacterController.getUserCharacters);
router.get('/:id', CharacterController.getCharacterById);
router.post('/', authenticateToken, CharacterController.createCharacter);
router.put('/:id', authenticateToken, CharacterController.updateCharacter);
router.delete('/:id', authenticateToken, CharacterController.deleteCharacter);
router.get('/check-name', authenticateToken, CharacterController.checkNameExists);

export default router;
