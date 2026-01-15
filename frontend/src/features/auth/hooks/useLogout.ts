import { useAuthStore } from '../store';
import { authService } from '../services';

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const setLoggingOut = useAuthStore((state) => state.setLoggingOut);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      logout();
    }
  };

  return { logout: handleLogout };
}
