// app/guards/require-auth.tsx
"use client";

import { useAuth } from "../context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  // Récupérez bien isLoggingOut ici
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();
  const hasnotified = useRef(false);

  useEffect(() => {
    // Si le chargement est terminé et que l'utilisateur n'est pas authentifié
    if (!isLoading && !isAuthenticated) {
      // CAS 1 : Déconnexion accidentelle (session expirée, etc.)
      if (!isLoggingOut) {
        if (!hasnotified.current) {
          toast.error("Accès refusé", {
            description: "Vous devez être connecté pour accéder à cette page.",
          });
          hasnotified.current = true;
        }
        router.push("/login");
      }

      // CAS 2 : Déconnexion volontaire (isLoggingOut est true)
      else {
        // Redirection silencieuse sans toast
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, isLoggingOut, router]);
  // Le tableau fait maintenant toujours 4 éléments.

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
