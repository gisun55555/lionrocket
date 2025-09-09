import { saveFile, deleteFile, getFileUrl } from '../utils/fileUpload';
import { fileUploadSchema } from '../lib/validation';

export class FileService {
  // 파일 업로드
  static async uploadFile(file: Express.Multer.File): Promise<{ url: string; path: string }> {
    // 파일 검증
    fileUploadSchema.parse(file);
    
    // 파일 저장
    const filePath = await saveFile(file);
    const fileUrl = getFileUrl(filePath);
    
    return {
      url: fileUrl,
      path: filePath,
    };
  }

  // 파일 삭제
  static async deleteFile(filePath: string): Promise<void> {
    await deleteFile(filePath);
  }

  // 이미지 최적화 (향후 확장용)
  static async optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    // 현재는 원본 반환, 향후 sharp 라이브러리 등으로 최적화 가능
    return file.buffer;
  }

  // Base64 인코딩 (캐싱 최적화용)
  static encodeToBase64(file: Express.Multer.File): string {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  // Blob URL 생성을 위한 파일 정보
  static getFileInfo(file: Express.Multer.File) {
    return {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      lastModified: Date.now(),
    };
  }
}
