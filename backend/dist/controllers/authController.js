"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const validation_1 = require("../lib/validation");
class AuthController {
    static async register(req, res) {
        try {
            const validatedData = validation_1.registerSchema.parse(req.body);
            const result = await authService_1.AuthService.register(validatedData);
            return res.status(201).json({
                success: true,
                message: '회원가입이 완료되었습니다',
                data: result,
            });
        }
        catch (error) {
            console.error('회원가입 오류:', error);
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
    static async login(req, res) {
        try {
            const validatedData = validation_1.loginSchema.parse(req.body);
            const result = await authService_1.AuthService.login(validatedData);
            return res.json({
                success: true,
                message: '로그인되었습니다',
                data: result,
            });
        }
        catch (error) {
            console.error('로그인 오류:', error);
            if (error instanceof Error) {
                return res.status(401).json({
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
    static async logout(req, res) {
        return res.json({
            success: true,
            message: '로그아웃되었습니다',
        });
    }
    static async getMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: '인증이 필요합니다',
                });
            }
            const user = await authService_1.AuthService.getUserById(req.user.id);
            return res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            console.error('사용자 정보 조회 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
    static async checkEmail(req, res) {
        try {
            const { email } = req.query;
            if (!email || typeof email !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: '이메일을 입력해주세요',
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: '유효한 이메일 형식이 아닙니다',
                });
            }
            const exists = await authService_1.AuthService.checkEmailExists(email);
            return res.json({
                success: true,
                data: {
                    email,
                    available: !exists,
                },
            });
        }
        catch (error) {
            console.error('이메일 중복 확인 오류:', error);
            return res.status(500).json({
                success: false,
                message: '서버 내부 오류가 발생했습니다',
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map