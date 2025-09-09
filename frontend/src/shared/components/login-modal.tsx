'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useLogin } from '@/shared/hooks/use-auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });
      
      // 성공 시
      onClose();
      onSuccess?.();
    } catch (error) {
      // 에러는 useLogin 훅에서 이미 콘솔에 출력됨
      console.error('로그인 모달 에러:', error);
    }
  };

  const fillTestAccount = () => {
    setEmail('test@example.com');
    setPassword('test1234');
  };

  const handleClose = () => {
    if (!loginMutation.isPending) {
      onClose();
      // 폼 초기화
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setRememberMe(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            🚀 AI 채팅 서비스 로그인
          </DialogTitle>
          <DialogDescription className="text-center">
            AI 캐릭터들과 특별한 대화를 시작해보세요
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력 */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loginMutation.isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 로그인 상태 유지 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={loginMutation.isPending}
            />
            <Label htmlFor="remember" className="text-sm">
              로그인 상태 유지
            </Label>
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending || !email || !password}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인하기'
            )}
          </Button>

          {/* 에러 메시지 */}
          {loginMutation.isError && (
            <div className="text-sm text-red-600 text-center bg-red-50 dark:bg-red-950/50 p-2 rounded">
              로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.
            </div>
          )}
        </form>

        {/* 테스트 계정 안내 */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                💡 테스트 계정으로 바로 체험해보세요
              </p>
              <div className="space-y-1 text-sm">
                <p className="flex items-center justify-center gap-2">
                  <Mail className="h-3 w-3" />
                  test@example.com
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Lock className="h-3 w-3" />
                  test1234
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillTestAccount}
                disabled={loginMutation.isPending}
                className="mt-2"
              >
                테스트 계정 정보 입력
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
