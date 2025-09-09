'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, LogIn, LogOut, User } from 'lucide-react';
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
import { TokenManager } from '@/shared/apis';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export function GlobalHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 사용자 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      if (TokenManager.hasToken()) {
        try {
          // TODO: API 호출로 사용자 정보 가져오기
          // const userData = await authApi.getMe();
          // setUser(userData);
          
          // 임시로 더미 데이터 사용
          setUser({
            id: '1',
            email: 'test@example.com',
            name: '테스트 사용자'
          });
        } catch {
          TokenManager.removeToken();
          setUser(null);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    TokenManager.removeToken();
    setUser(null);
    router.push('/');
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
            {user ? (
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
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

      {/* 로그인 모달 - 나중에 구현 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="bg-background p-6 shadow-lg border rounded-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-4">로그인</h2>
              <p className="text-muted-foreground mb-4">로그인 기능은 곧 구현됩니다.</p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsLoginModalOpen(false)}
                >
                  닫기
                </Button>
                <Button 
                  onClick={() => {
                    // 임시로 로그인 처리
                    TokenManager.setToken('dummy-token');
                    setUser({
                      id: '1',
                      email: 'test@example.com',
                      name: '테스트 사용자'
                    });
                    setIsLoginModalOpen(false);
                  }}
                >
                  테스트 로그인
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
