"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../lib/prisma");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '인증 토큰이 필요합니다' });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.uid },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (!user) {
            return res.status(401).json({ message: '사용자를 찾을 수 없습니다' });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({
            message: '유효하지 않은 토큰입니다',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next();
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.uid },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map