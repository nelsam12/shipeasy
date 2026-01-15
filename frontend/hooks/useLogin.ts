import { useState } from "react";
import { login as loginService } from "@/services/auth.service";
import { useAuth } from "./useAuth";
import type { LoginModel, User } from "@/types";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  async function login(credentials: LoginModel): Promise<User> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService(credentials);
      const user = response.data;
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur de connexion";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
