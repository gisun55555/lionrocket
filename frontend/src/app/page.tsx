'use client';

import { LoginModal } from '@/shared/components/login-modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useDefaultCharacters } from '@/shared/hooks';
import { HeroSection, QuoteSection } from './section';

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useAuth();
  const { data: defaultCharacters, isLoading: charactersLoading } = useDefaultCharacters();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    router.push('/characters');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HeroSection
        user={user || null}
        isLoading={isLoading}
        defaultCharacters={defaultCharacters}
        charactersLoading={charactersLoading}
        onLoginClick={handleLoginClick}
      />
      
      <QuoteSection />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}