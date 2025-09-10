'use client';

import { Loader2 } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
        <p className="text-lg text-slate-600 dark:text-slate-400">채팅을 불러오는 중...</p>
      </div>
    </div>
  );
}
