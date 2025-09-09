import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class AuthController {
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getMe(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static checkEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=authController.d.ts.map