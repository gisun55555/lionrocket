'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { Character } from '@/shared/types/api';

interface ChatHeaderProps {
  character: Character;
  onBack: () => void;
}

export function ChatHeader({ character, onBack }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-500/20 dark:ring-blue-400/30 shadow-lg">
                <AvatarImage src={character.thumbnail || undefined} alt={character.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {character.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {character.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    character.isDefault 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {character.isDefault ? '✨ 기본 캐릭터' : '👤 내 캐릭터'}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">온라인</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
