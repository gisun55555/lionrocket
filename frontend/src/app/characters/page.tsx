'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAllCharacters } from '@/shared/hooks';
import { CharacterCreateModal } from '@/shared/components';
import { 
  DefaultCharactersSection, 
  UserCharactersSection, 
  PageHeader, 
  LoadingSkeleton 
} from './section';

export default function CharactersPage() {
  const router = useRouter();
  const { data: characters, isLoading } = useAllCharacters();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCharacterSelect = (characterId: string) => {
    router.push(`/chat/${characterId}`);
  };

  const handleCreateCharacter = () => {
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const defaultCharacters = characters?.filter(char => char.isDefault) || [];
  const userCharacters = characters?.filter(char => !char.isDefault) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader />
        
        <DefaultCharactersSection 
          characters={defaultCharacters}
          onCharacterSelect={handleCharacterSelect}
        />
        
        <UserCharactersSection 
          characters={userCharacters}
          onCharacterSelect={handleCharacterSelect}
          onCreateCharacter={handleCreateCharacter}
        />
      </div>

      <CharacterCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
