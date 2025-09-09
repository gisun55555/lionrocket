import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class FileController {
    static uploadImage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getImagePreview(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteImage(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=fileController.d.ts.map