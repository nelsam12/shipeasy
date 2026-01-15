"use client";

import { Role } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== role) {
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== role) return null;

  return <>{children}</>;
}
