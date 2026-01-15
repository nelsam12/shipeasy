// app/(dashboard)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layouts/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/layouts/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sécurité avec l'optional chaining user?.role
    if (!isLoading && user?.role && pathname === "/dashboard") {
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || (user && pathname === "/dashboard")) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        {user && <AppSidebar role={user.role} user={user} />}

        <SidebarInset>
          {/* Utilisation de ton DashboardHeader personnalisé */}
          <DashboardHeader />

          <main className="flex flex-1 flex-col gap-4 p-6 pt-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
