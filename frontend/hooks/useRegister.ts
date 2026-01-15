import { useState } from "react";
import { register as registerService } from "@/services/auth.service";
import { useAuth } from "./useAuth";
import type { CreateUserDto, User } from "@/types";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  async function register(data: CreateUserDto): Promise<User> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerService(data);
      const user = response.data;
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'inscription";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading, error };
}
