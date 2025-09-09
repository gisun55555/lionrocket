import { Request, Response } from 'express';
import { FileService } from '../services/fileService';
import { AuthenticatedRequest } from '../types/auth';

export class FileController {
  // 이미지 업로드 (캐릭터 썸네일용)
  static async uploadImage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '업로드할 파일이 없습니다',
        });
      }

      // 파일 업로드 처리
      const result = await FileService.uploadFile(req.file);

      return res.status(201).json({
        success: true,
        message: '이미지가 성공적으로 업로드되었습니다',
        data: {
          url: result.url,
          path: result.path,
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error('이미지 업로드 오류:', error);

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

  // 이미지 미리보기용 Base64 인코딩
  static async getImagePreview(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '업로드할 파일이 없습니다',
        });
      }

      // Base64 인코딩
      const base64Data = FileService.encodeToBase64(req.file);
      const fileInfo = FileService.getFileInfo(req.file);

      return res.json({
        success: true,
        message: '이미지 미리보기 데이터가 생성되었습니다',
        data: {
          base64: base64Data,
          fileInfo: fileInfo,
        },
      });
    } catch (error) {
      console.error('이미지 미리보기 오류:', error);

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

  // 업로드된 이미지 삭제
  static async deleteImage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      const { path } = req.body;

      if (!path) {
        return res.status(400).json({
          success: false,
          message: '삭제할 파일 경로가 필요합니다',
        });
      }

      // 파일 삭제
      await FileService.deleteFile(path);

      return res.json({
        success: true,
        message: '이미지가 삭제되었습니다',
      });
    } catch (error) {
      console.error('이미지 삭제 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }
}
