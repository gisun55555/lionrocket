import { Router } from 'express';
import { FileController } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';
import { multerConfig } from '../utils/fileUpload';

const router = Router();

// 이미지 업로드 (캐릭터 썸네일용)
router.post(
  '/image',
  authenticateToken,
  multerConfig.single('thumbnail'), // 'thumbnail' 필드명으로 파일 업로드
  FileController.uploadImage
);

// 이미지 미리보기용 Base64 인코딩
router.post(
  '/preview',
  authenticateToken,
  multerConfig.single('thumbnail'),
  FileController.getImagePreview
);

// 이미지 삭제
router.delete('/image', authenticateToken, FileController.deleteImage);

export default router;
