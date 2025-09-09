'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { LoginModal } from './login-modal';
import { useAuth, useLogout } from '@/shared/hooks';
import { useState } from 'react';

export function GlobalHeader() {
  const router = useRouter();
  const { data: user, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // 로그아웃 후 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 있어도 메인 페이지로 이동 (로컬 데이터는 이미 정리됨)
      router.push('/');
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI Chat Service
            </span>
          </Link>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 다크모드 토글 */}
            <ThemeToggle />

            {/* 로그인/사용자 메뉴 */}
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/characters" className="cursor-pointer">
                      <Bot className="mr-2 h-4 w-4" />
                      캐릭터 선택
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer"
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={openLoginModal} variant="default" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </>
  );
}
