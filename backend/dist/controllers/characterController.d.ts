import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class CharacterController {
    static getAllCharacters(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDefaultCharacters(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getUserCharacters(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static getCharacterById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createCharacter(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateCharacter(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteCharacter(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static checkNameExists(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=characterController.d.ts.map