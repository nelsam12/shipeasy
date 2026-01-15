"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/models/user.model";
import { getMe, logout as apiLogout } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean; // Ajoutez ceci
  setUser: (user: User | null) => void; // Permet une mise à jour manuelle
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // État pour la déconnexion

  async function refreshUser() {
    // Note: on garde isLoading à true uniquement au premier chargement
    try {
      const response = await getMe();
      // On déballe la structure data.data.user de votre backend
      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoggingOut(true); // <--- On signale le début de déconnexion
    try {
      await apiLogout();
    } finally {
      setUser(null);
      // On ne reset pas immédiatement pour laisser le guard tranquille
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser, // Crucial pour l'étape 2
        refreshUser,
        isLoggingOut,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
