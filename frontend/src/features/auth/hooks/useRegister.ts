import { useState } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../services';
import { RegisterData } from '../types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.register(data);
      setUser(user);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
