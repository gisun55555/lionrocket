export declare class FileService {
    static uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        path: string;
    }>;
    static deleteFile(filePath: string): Promise<void>;
    static optimizeImage(file: Express.Multer.File): Promise<Buffer>;
    static encodeToBase64(file: Express.Multer.File): string;
    static getFileInfo(file: Express.Multer.File): {
        name: string;
        type: string;
        size: number;
        lastModified: number;
    };
}
//# sourceMappingURL=fileService.d.ts.map