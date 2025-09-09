"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async register(data) {
        const { email, password, name } = data;
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('이미 사용 중인 이메일입니다');
        }
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        const token = (0, jwt_1.generateToken)({
            uid: user.id,
            email: user.email,
        });
        return {
            token,
            user,
        };
    }
    static async login(data) {
        const { email, password } = data;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
        }
        const token = (0, jwt_1.generateToken)({
            uid: user.id,
            email: user.email,
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
    static async getUserById(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다');
        }
        return user;
    }
    static async checkEmailExists(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        return !!user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map