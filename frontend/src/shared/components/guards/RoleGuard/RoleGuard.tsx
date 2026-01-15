'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth/hooks';
import { Role } from '@/src/features/auth/types';
import { LoadingSpinner } from '../../feedback/LoadingSpinner';
import { ROUTES } from '@/src/shared/constants';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const roleKey = user.role.toUpperCase() as keyof typeof ROUTES.DASHBOARD;
      const redirectPath = ROUTES.DASHBOARD[roleKey] || ROUTES.HOME;
      router.push(redirectPath);
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
