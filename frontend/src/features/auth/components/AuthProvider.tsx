'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../services';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await authService.getMe();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
