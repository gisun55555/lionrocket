"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fileUpload_1 = require("../utils/fileUpload");
const validation_1 = require("../lib/validation");
class FileService {
    static async uploadFile(file) {
        validation_1.fileUploadSchema.parse(file);
        const filePath = await (0, fileUpload_1.saveFile)(file);
        const fileUrl = (0, fileUpload_1.getFileUrl)(filePath);
        return {
            url: fileUrl,
            path: filePath,
        };
    }
    static async deleteFile(filePath) {
        await (0, fileUpload_1.deleteFile)(filePath);
    }
    static async optimizeImage(file) {
        return file.buffer;
    }
    static encodeToBase64(file) {
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }
    static getFileInfo(file) {
        return {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            lastModified: Date.now(),
        };
    }
}
exports.FileService = FileService;
//# sourceMappingURL=fileService.js.map