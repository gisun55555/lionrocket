'use client';

import { Plus, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { Character } from '@/shared/types/api';

interface UserCharactersSectionProps {
  characters: Character[];
  onCharacterSelect: (characterId: string) => void;
  onCreateCharacter: () => void;
}

export function UserCharactersSection({ characters, onCharacterSelect, onCreateCharacter }: UserCharactersSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            나만의 캐릭터
          </h2>
        </div>
        
        <Button 
          onClick={onCreateCharacter}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          캐릭터 만들기
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary transition-colors cursor-pointer"
          onClick={onCreateCharacter}
        >
          <CardContent className="text-center space-y-4 py-8">
            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                캐릭터 추가
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                새로운 캐릭터 만들기
              </p>
            </div>
          </CardContent>
        </Card>

        {characters.map((character) => (
          <Card 
            key={character.id}
            className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onCharacterSelect(character.id)}
          >
            <CardContent className="text-center space-y-4">
              <div className="relative">
                <Avatar className="w-28 h-28 mx-auto ring-4 ring-white/50 dark:ring-slate-700/50 group-hover:ring-green-400/50 transition-all duration-300 shadow-2xl">
                  <AvatarImage 
                    src={character.thumbnail || undefined} 
                    alt={character.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    {character.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  내 캐릭터
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {character.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {character.prompt.slice(0, 80)}...
                </p>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-blue-500 group-hover:text-white transition-colors"
              >
                대화 시작하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {characters.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            아직 만든 캐릭터가 없어요
          </h3>
          <p className="text-slate-500 dark:text-slate-500 mb-6">
            첫 번째 캐릭터를 만들어보세요!
          </p>
          <Button onClick={onCreateCharacter}>
            <Plus className="h-4 w-4 mr-2" />
            첫 캐릭터 만들기
          </Button>
        </div>
      )}
    </div>
  );
}
