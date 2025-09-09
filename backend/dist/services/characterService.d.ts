import { CreateCharacterInput, UpdateCharacterInput, CharacterResponse } from '../lib/validation';
export declare class CharacterService {
    static getAllCharacters(userId?: string): Promise<CharacterResponse[]>;
    static getDefaultCharacters(): Promise<CharacterResponse[]>;
    static getUserCharacters(userId: string): Promise<CharacterResponse[]>;
    static getCharacterById(characterId: string): Promise<CharacterResponse | null>;
    static createCharacter(data: CreateCharacterInput, userId: string): Promise<CharacterResponse>;
    static updateCharacter(characterId: string, data: UpdateCharacterInput, userId: string): Promise<CharacterResponse>;
    static deleteCharacter(characterId: string, userId: string): Promise<void>;
    static checkNameExists(name: string, userId: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=characterService.d.ts.map