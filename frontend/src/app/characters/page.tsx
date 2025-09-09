'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAllCharacters } from '@/shared/hooks';
import { CharacterCreateModal } from '@/shared/components';

export default function CharactersPage() {
  const router = useRouter();
  const { data: characters, isLoading } = useAllCharacters();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 캐릭터 선택 핸들러
  const handleCharacterSelect = (characterId: string) => {
    router.push(`/chat/${characterId}`);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 스켈레톤 */}
          <div className="text-center mb-12">
            <div className="h-8 w-96 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
            <div className="h-6 w-[600px] bg-muted animate-pulse rounded-lg mx-auto" />
          </div>

          {/* 캐릭터 그리드 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <CardContent className="text-center space-y-4">
                  <div className="w-20 h-20 bg-muted animate-pulse rounded-full mx-auto" />
                  <div className="h-6 w-32 bg-muted animate-pulse rounded mx-auto" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 기본 캐릭터와 사용자 캐릭터 분리
  const defaultCharacters = characters?.filter(char => char.isDefault) || [];
  const userCharacters = characters?.filter(char => !char.isDefault) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="container mx-auto px-4 py-12">
        {/* 페이지 헤더 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
            대화할 캐릭터를 선택하세요
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            당신만의 AI 캐릭터와 특별한 대화를 시작해보세요.
          </p>
        </div>

        {/* 기본 캐릭터 섹션 */}
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
            {defaultCharacters.map((character) => (
              <Card 
                key={character.id}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-105 hover:-translate-y-2"
                onClick={() => handleCharacterSelect(character.id)}
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

        {/* 사용자 캐릭터 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                나만의 캐릭터
              </h2>
            </div>
            
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              캐릭터 만들기
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 캐릭터 추가 카드 */}
            <Card 
              className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary transition-colors cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
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

            {/* 사용자 캐릭터들 */}
            {userCharacters.map((character) => (
              <Card 
                key={character.id}
                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleCharacterSelect(character.id)}
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

          {/* 빈 상태 */}
          {userCharacters.length === 0 && (
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
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                첫 캐릭터 만들기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 캐릭터 생성 모달 */}
      <CharacterCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
