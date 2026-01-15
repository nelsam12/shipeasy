'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/src/features/auth/hooks';
import { LoadingSpinner } from '../../feedback/LoadingSpinner';
import { ROUTES, MESSAGES } from '@/src/shared/constants';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Case 1: Accidental logout (session expired, etc.)
      if (!isLoggingOut) {
        if (!hasNotified.current) {
          toast.error('Accès refusé', {
            description: MESSAGES.AUTH.UNAUTHORIZED,
          });
          hasNotified.current = true;
        }
        router.push(ROUTES.LOGIN);
      }
      // Case 2: Voluntary logout
      else {
        router.push(ROUTES.LOGIN);
      }
    }
  }, [isLoading, isAuthenticated, isLoggingOut, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
