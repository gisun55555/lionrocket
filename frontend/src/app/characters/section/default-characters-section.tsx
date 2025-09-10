'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { Character } from '@/shared/types/api';

interface DefaultCharactersSectionProps {
  characters: Character[];
  onCharacterSelect: (characterId: string) => void;
}

export function DefaultCharactersSection({ characters, onCharacterSelect }: DefaultCharactersSectionProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          기본 제공 캐릭터
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {characters.map((character) => (
          <Card 
            key={character.id}
            className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105 hover:-translate-y-2"
            onClick={() => onCharacterSelect(character.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="relative p-8 text-center space-y-6">
              <div className="relative">
                <Avatar className="w-32 h-32 mx-auto ring-4 ring-white/50 dark:ring-slate-700/50 group-hover:ring-blue-400/50 transition-all duration-300 shadow-2xl">
                  <AvatarImage 
                    src={character.thumbnail || undefined} 
                    alt={character.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {character.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                  ✨ 기본
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {character.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {character.prompt.slice(0, 100)}...
                </p>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-semibold group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                대화 시작하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
