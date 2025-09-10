'use client';

import { Sparkles } from 'lucide-react';

export function PageHeader() {
  return (
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
  );
}
