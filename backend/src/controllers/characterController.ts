import { Request, Response } from 'express';
import { CharacterService } from '../services/characterService';
import { createCharacterSchema, updateCharacterSchema } from '../lib/validation';
import { AuthenticatedRequest } from '../types/auth';

export class CharacterController {
  // 모든 캐릭터 조회 (기본 + 사용자 캐릭터)
  static async getAllCharacters(req: AuthenticatedRequest, res: Response) {
    try {
      const characters = await CharacterService.getAllCharacters(req.user?.id);

      return res.json({
        success: true,
        data: characters,
      });
    } catch (error) {
      console.error('캐릭터 목록 조회 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 기본 캐릭터만 조회
  static async getDefaultCharacters(req: Request, res: Response) {
    try {
      const characters = await CharacterService.getDefaultCharacters();

      return res.json({
        success: true,
        data: characters,
      });
    } catch (error) {
      console.error('기본 캐릭터 조회 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 사용자 캐릭터만 조회
  static async getUserCharacters(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      const characters = await CharacterService.getUserCharacters(req.user.id);

      return res.json({
        success: true,
        data: characters,
      });
    } catch (error) {
      console.error('사용자 캐릭터 조회 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 캐릭터 ID로 조회
  static async getCharacterById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const character = await CharacterService.getCharacterById(id);

      if (!character) {
        return res.status(404).json({
          success: false,
          message: '캐릭터를 찾을 수 없습니다',
        });
      }

      return res.json({
        success: true,
        data: character,
      });
    } catch (error) {
      console.error('캐릭터 조회 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }

  // 캐릭터 생성
  static async createCharacter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      // 입력 데이터 검증
      const validatedData = createCharacterSchema.parse(req.body);

      // 캐릭터 생성
      const character = await CharacterService.createCharacter(validatedData, req.user.id);

      return res.status(201).json({
        success: true,
        message: '캐릭터가 생성되었습니다',
        data: character,
      });
    } catch (error) {
      console.error('캐릭터 생성 오류:', error);

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

  // 캐릭터 수정
  static async updateCharacter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      const { id } = req.params;

      // 입력 데이터 검증
      const validatedData = updateCharacterSchema.parse(req.body);

      // 캐릭터 수정
      const character = await CharacterService.updateCharacter(id, validatedData, req.user.id);

      return res.json({
        success: true,
        message: '캐릭터가 수정되었습니다',
        data: character,
      });
    } catch (error) {
      console.error('캐릭터 수정 오류:', error);

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

  // 캐릭터 삭제
  static async deleteCharacter(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      const { id } = req.params;

      // 캐릭터 삭제
      await CharacterService.deleteCharacter(id, req.user.id);

      return res.json({
        success: true,
        message: '캐릭터가 삭제되었습니다',
      });
    } catch (error) {
      console.error('캐릭터 삭제 오류:', error);

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

  // 캐릭터 이름 중복 확인
  static async checkNameExists(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다',
        });
      }

      const { name } = req.query;
      const { excludeId } = req.query;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          message: '캐릭터 이름을 입력해주세요',
        });
      }

      const exists = await CharacterService.checkNameExists(
        name, 
        req.user.id, 
        excludeId as string
      );

      return res.json({
        success: true,
        data: {
          name,
          available: !exists,
        },
      });
    } catch (error) {
      console.error('캐릭터 이름 중복 확인 오류:', error);

      return res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다',
      });
    }
  }
}
