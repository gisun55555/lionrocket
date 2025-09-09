'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          404 - 페이지를 찾을 수 없습니다
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전 페이지
          </Button>
        </div>
      </div>
    </div>
  );
}
