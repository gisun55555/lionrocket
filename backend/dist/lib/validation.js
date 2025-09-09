"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.fileUploadSchema = exports.updateCharacterSchema = exports.createCharacterSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('유효한 이메일 주소를 입력해주세요')
        .min(1, '이메일을 입력해주세요'),
    password: zod_1.z
        .string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
        .max(100, '비밀번호는 100자 이하여야 합니다'),
    name: zod_1.z
        .string()
        .min(2, '이름은 최소 2자 이상이어야 합니다')
        .max(50, '이름은 50자 이하여야 합니다')
        .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 사용 가능합니다'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('유효한 이메일 주소를 입력해주세요')
        .min(1, '이메일을 입력해주세요'),
    password: zod_1.z
        .string()
        .min(1, '비밀번호를 입력해주세요'),
});
exports.createCharacterSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, '캐릭터 이름은 최소 2자 이상이어야 합니다')
        .max(50, '캐릭터 이름은 50자 이하여야 합니다'),
    prompt: zod_1.z
        .string()
        .min(10, '캐릭터 프롬프트는 최소 10자 이상이어야 합니다')
        .max(1000, '캐릭터 프롬프트는 1000자 이하여야 합니다'),
    thumbnail: zod_1.z
        .string()
        .optional(),
});
exports.updateCharacterSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, '캐릭터 이름은 최소 2자 이상이어야 합니다')
        .max(50, '캐릭터 이름은 50자 이하여야 합니다')
        .optional(),
    prompt: zod_1.z
        .string()
        .min(10, '캐릭터 프롬프트는 최소 10자 이상이어야 합니다')
        .max(1000, '캐릭터 프롬프트는 1000자 이하여야 합니다')
        .optional(),
    thumbnail: zod_1.z
        .string()
        .optional(),
});
exports.fileUploadSchema = zod_1.z.object({
    fieldname: zod_1.z.string(),
    originalname: zod_1.z.string(),
    encoding: zod_1.z.string(),
    mimetype: zod_1.z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'], {
        message: 'PNG, JPEG, WEBP, AVIF 파일만 업로드 가능합니다'
    }),
    size: zod_1.z.number().max(5 * 1024 * 1024, '파일 크기는 5MB 이하여야 합니다'),
    buffer: zod_1.z.instanceof(Buffer),
});
exports.sendMessageSchema = zod_1.z.object({
    content: zod_1.z
        .string()
        .min(1, '메시지를 입력해주세요')
        .max(200, '메시지는 200자 이하여야 합니다')
        .trim(),
    characterId: zod_1.z
        .string()
        .min(1, '캐릭터를 선택해주세요'),
});
//# sourceMappingURL=validation.js.map