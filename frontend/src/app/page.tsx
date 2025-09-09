'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LoginModal } from '@/shared/components/login-modal';
import { MessageCircle, Users, Sparkles, ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks';

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            🎭 AI 캐릭터들과
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              특별한 대화
            </span>
            를 시작하세요
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            창의적이고 전문적인 AI 캐릭터들과 자연스러운 대화를 나누며,
            <br />
            새로운 아이디어와 영감을 얻어보세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isLoading ? (
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-muted animate-pulse rounded-lg" />
                <div className="h-12 w-24 bg-muted animate-pulse rounded-lg" />
              </div>
            ) : user ? (
              // 로그인된 사용자를 위한 버튼들
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/characters">
                  <Button size="lg" className="text-lg px-8 py-6">
                    <Bot className="mr-2 h-5 w-5" />
                    캐릭터 선택하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4 flex items-center">
                  👋 안녕하세요, <span className="font-medium ml-1">{user.name}</span>님!
                </div>
              </div>
            ) : (
              // 비로그인 사용자를 위한 버튼들
              <>
                <Link href="/characters">
                  <Button size="lg" className="text-lg px-8 py-6">
                    <Sparkles className="mr-2 h-5 w-5" />
                    시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  로그인
                </Button>
              </>
            )}
          </div>

          {/* Character Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">친근한 AI 어시스턴트</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  도움이 되는 AI와 대화해보세요
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">창의적 작가</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  상상력이 풍부한 창작 파트너
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">기술 전문가</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  프로그래밍과 기술의 전문가
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl mb-2">🎭</div>
              <h3 className="text-lg font-semibold">3개의 기본 캐릭터</h3>
              <p className="text-slate-600 dark:text-slate-400">
                전문가급 AI들과 대화해보세요
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="text-lg font-semibold">자연스러운 대화</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Claude AI 기반 실시간 채팅
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="text-lg font-semibold">나만의 캐릭터</h3>
              <p className="text-slate-600 dark:text-slate-400">
                직접 만들어보세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <blockquote className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 italic max-w-3xl mx-auto">
          &ldquo;창작자는 방향을 정하고, 젠버스는 그 길을 구현합니다.&rdquo;
        </blockquote>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          // 로그인 성공 시 캐릭터 선택 페이지로 이동
          router.push('/characters');
        }}
      />
    </div>
  );
}