"use client";

import { useAuth } from "../context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ajout de la vérification user?.role pour éviter le crash
    if (!isLoading && isAuthenticated && user?.role) {
      const targetPath = `/dashboard/${user.role.toLowerCase()}`;
      router.replace(targetPath);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || (isAuthenticated && user?.role)) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
