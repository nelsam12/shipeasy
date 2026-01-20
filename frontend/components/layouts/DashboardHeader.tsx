// components/dashboard-header.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Extraction des segments de l'URL
  const segments = pathname.split("/").filter(Boolean);

  return (
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2">
          {/* Bouton Retour */}
          <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>

          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Trigger pour mobile/réduit */}
          <SidebarTrigger className="-ml-1" />

          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Fil d'ariane dynamique */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>

              {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;

                return (
                    <React.Fragment key={href}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage className="capitalize font-medium">
                              {segment. replace(/-/g, " ")}
                            </BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink
                                href={href}
                                className="capitalize hidden md:block"
                            >
                              {segment.replace(/-/g, " ")}
                            </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  );
}