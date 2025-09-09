"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterController = void 0;
const characterService_1 = require("../services/characterService");
const validation_1 = require("../lib/validation");
class CharacterController {
    static async getAllCharacters(req, res) {
        try {
            const characters = await characterService_1.CharacterService.getAllCharacters(req.user?.id);
            return res.json({
                success: true,
                data: characters,
            });
        }
        catch (error) {
            console.error('캐릭터 목록 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async getDefaultCharacters(req, res) {
        try {
            const characters = await characterService_1.CharacterService.getDefaultCharacters();
            return res.json({
                success: true,
                data: characters,
            });
        }
        catch (error) {
            console.error('기본 캐릭터 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async getUserCharacters(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const characters = await characterService_1.CharacterService.getUserCharacters(req.user.id);
            return res.json({
                success: true,
                data: characters,
            });
        }
        catch (error) {
            console.error('사용자 캐릭터 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async getCharacterById(req, res) {
        try {
            const { id } = req.params;
            const character = await characterService_1.CharacterService.getCharacterById(id);
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
        }
        catch (error) {
            console.error('캐릭터 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async createCharacter(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const validatedData = validation_1.createCharacterSchema.parse(req.body);
            const character = await characterService_1.CharacterService.createCharacter(validatedData, req.user.id);
            return res.status(201).json({
                success: true,
                message: '캐릭터가 생성되었습니다',
                data: character,
            });
        }
        catch (error) {
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
    static async updateCharacter(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const { id } = req.params;
            const validatedData = validation_1.updateCharacterSchema.parse(req.body);
            const character = await characterService_1.CharacterService.updateCharacter(id, validatedData, req.user.id);
            return res.json({
                success: true,
                message: '캐릭터가 수정되었습니다',
                data: character,
            });
        }
        catch (error) {
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
    static async deleteCharacter(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const { id } = req.params;
            await characterService_1.CharacterService.deleteCharacter(id, req.user.id);
            return res.json({
                success: true,
                message: '캐릭터가 삭제되었습니다',
            });
        }
        catch (error) {
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
    static async checkNameExists(req, res) {
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
            const exists = await characterService_1.CharacterService.checkNameExists(name, req.user.id, excludeId);
            return res.json({
                success: true,
                data: {
                    name,
                    available: !exists,
                },
            });
        }
        catch (error) {
            console.error('캐릭터 이름 중복 확인 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
}
exports.CharacterController = CharacterController;
//# sourceMappingURL=characterController.js.map