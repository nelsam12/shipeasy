"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Case 1: Accidental logout (expired session, etc.)
      if (!isLoggingOut) {
        if (!hasNotified.current) {
          toast.error("Accès refusé", {
            description: "Vous devez être connecté pour accéder à cette page.",
          });
          hasNotified.current = true;
        }
        router.push("/login");
      } else {
        // Case 2: Intentional logout - silent redirect
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, isLoggingOut, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
