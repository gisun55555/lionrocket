'use client';

import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ErrorStateProps {
  onBack: () => void;
}

export function ErrorState({ onBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Bot className="h-16 w-16 mx-auto text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">캐릭터를 찾을 수 없습니다</h1>
        <p className="text-slate-600 dark:text-slate-400">존재하지 않는 캐릭터입니다.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          캐릭터 선택으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
