import { JWTPayload } from '../types/auth';
export declare const generateToken: (payload: {
    uid: string;
    email: string;
}) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const generateShortToken: (payload: {
    uid: string;
    email: string;
}) => string;
//# sourceMappingURL=jwt.d.ts.map