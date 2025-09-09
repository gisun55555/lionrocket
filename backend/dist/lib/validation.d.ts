import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const createCharacterSchema: z.ZodObject<{
    name: z.ZodString;
    prompt: z.ZodString;
    thumbnail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCharacterSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}
export interface CharacterResponse {
    id: string;
    name: string;
    prompt: string;
    thumbnail?: string;
    isDefault: boolean;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}
export declare const fileUploadSchema: z.ZodObject<{
    fieldname: z.ZodString;
    originalname: z.ZodString;
    encoding: z.ZodString;
    mimetype: z.ZodEnum<{
        "image/jpeg": "image/jpeg";
        "image/jpg": "image/jpg";
        "image/png": "image/png";
        "image/webp": "image/webp";
        "image/avif": "image/avif";
    }>;
    size: z.ZodNumber;
    buffer: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
}, z.core.$strip>;
export declare const sendMessageSchema: z.ZodObject<{
    content: z.ZodString;
    characterId: z.ZodString;
}, z.core.$strip>;
export interface MessageResponse {
    id: string;
    content: string;
    isUser: boolean;
    userId: string;
    characterId: string;
    createdAt: string;
}
export interface ConversationResponse {
    characterId: string;
    characterName: string;
    messages: MessageResponse[];
    totalMessages: number;
}
export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
//# sourceMappingURL=validation.d.ts.map