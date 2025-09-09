import { Request } from 'express';
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}
export interface JWTPayload {
    uid: string;
    email: string;
    iat: number;
    exp: number;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}
//# sourceMappingURL=auth.d.ts.map