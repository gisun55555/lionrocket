import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// 업로드 디렉토리 생성 함수
export const createUploadDir = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const uploadDir = path.join(process.cwd(), 'uploads', String(year), month);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  return uploadDir;
};

// 안전한 파일명 생성 함수
export const generateSafeFileName = (originalName: string): string => {
  const extension = path.extname(originalName).toLowerCase();
  const hash = crypto.randomBytes(16).toString('hex');
  return `${hash}${extension}`;
};

// 파일 확장자 검증
export const isValidImageFile = (mimetype: string): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/avif'
  ];
  return allowedTypes.includes(mimetype);
};

// 매직넘버로 파일 타입 검증
export const validateFileType = (buffer: Buffer): boolean => {
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }
  
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return true;
  }
  
  // WebP
  if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return true;
  }
  
  return false;
};

// Multer 설정
export const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // 단일 파일만
  },
  fileFilter: (req, file, cb) => {
    if (isValidImageFile(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('PNG, JPEG, WEBP, AVIF 파일만 업로드 가능합니다'));
    }
  },
});

// 파일 저장 함수
export const saveFile = async (file: Express.Multer.File): Promise<string> => {
  // 매직넘버 검증
  if (!validateFileType(file.buffer)) {
    throw new Error('유효하지 않은 이미지 파일입니다');
  }
  
  const uploadDir = createUploadDir();
  const safeFileName = generateSafeFileName(file.originalname);
  const filePath = path.join(uploadDir, safeFileName);
  
  // 파일 저장
  await fs.promises.writeFile(filePath, file.buffer);
  
  // 상대 경로 반환 (uploads/2025/09/hash.jpg)
  const relativePath = path.relative(process.cwd(), filePath);
  return relativePath.replace(/\\/g, '/'); // Windows 호환성
};

// 파일 삭제 함수
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    // 파일 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
};

// 파일 URL 생성 함수
export const getFileUrl = (filePath: string): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/${filePath}`;
};
