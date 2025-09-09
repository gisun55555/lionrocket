"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteFile = exports.saveFile = exports.multerConfig = exports.validateFileType = exports.isValidImageFile = exports.generateSafeFileName = exports.createUploadDir = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const createUploadDir = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uploadDir = path_1.default.join(process.cwd(), 'uploads', String(year), month);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};
exports.createUploadDir = createUploadDir;
const generateSafeFileName = (originalName) => {
    const extension = path_1.default.extname(originalName).toLowerCase();
    const hash = crypto_1.default.randomBytes(16).toString('hex');
    return `${hash}${extension}`;
};
exports.generateSafeFileName = generateSafeFileName;
const isValidImageFile = (mimetype) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/avif'
    ];
    return allowedTypes.includes(mimetype);
};
exports.isValidImageFile = isValidImageFile;
const validateFileType = (buffer) => {
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return true;
    }
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return true;
    }
    if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return true;
    }
    return false;
};
exports.validateFileType = validateFileType;
exports.multerConfig = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if ((0, exports.isValidImageFile)(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('PNG, JPEG, WEBP, AVIF 파일만 업로드 가능합니다'));
        }
    },
});
const saveFile = async (file) => {
    if (!(0, exports.validateFileType)(file.buffer)) {
        throw new Error('유효하지 않은 이미지 파일입니다');
    }
    const uploadDir = (0, exports.createUploadDir)();
    const safeFileName = (0, exports.generateSafeFileName)(file.originalname);
    const filePath = path_1.default.join(uploadDir, safeFileName);
    await fs_1.default.promises.writeFile(filePath, file.buffer);
    const relativePath = path_1.default.relative(process.cwd(), filePath);
    return relativePath.replace(/\\/g, '/');
};
exports.saveFile = saveFile;
const deleteFile = async (filePath) => {
    try {
        const fullPath = path_1.default.join(process.cwd(), filePath);
        if (fs_1.default.existsSync(fullPath)) {
            await fs_1.default.promises.unlink(fullPath);
        }
    }
    catch (error) {
        console.error('파일 삭제 오류:', error);
    }
};
exports.deleteFile = deleteFile;
const getFileUrl = (filePath) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/${filePath}`;
};
exports.getFileUrl = getFileUrl;
//# sourceMappingURL=fileUpload.js.map