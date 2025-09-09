import { RegisterInput, LoginInput, AuthResponse } from '../lib/validation';
export declare class AuthService {
    static register(data: RegisterInput): Promise<AuthResponse>;
    static login(data: LoginInput): Promise<AuthResponse>;
    static getUserById(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        createdAt: Date;
    }>;
    static checkEmailExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=authService.d.ts.map