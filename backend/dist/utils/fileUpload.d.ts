import multer from 'multer';
export declare const createUploadDir: () => string;
export declare const generateSafeFileName: (originalName: string) => string;
export declare const isValidImageFile: (mimetype: string) => boolean;
export declare const validateFileType: (buffer: Buffer) => boolean;
export declare const multerConfig: multer.Multer;
export declare const saveFile: (file: Express.Multer.File) => Promise<string>;
export declare const deleteFile: (filePath: string) => Promise<void>;
export declare const getFileUrl: (filePath: string) => string;
//# sourceMappingURL=fileUpload.d.ts.map