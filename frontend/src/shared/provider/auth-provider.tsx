'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/shared/components/auth-guard';

interface AuthProviderProps {
  children: React.ReactNode;
}

const PROTECTED_ROUTES = ['/characters', '/chat'];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return <>{children}</>;
}
