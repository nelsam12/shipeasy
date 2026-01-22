"use client";

import * as React from "react";
import { LayoutDashboard, Package, Users, Settings, Headset } from "lucide-react";

import { NavMain } from "@/components/layouts/NavMain";
import { NavUser } from "@/components/layouts/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User, NavItem, Role } from "@/types";

const navigationMap: Record<string, NavItem[]> = {
  [Role.CLIENT]: [
    {
      title: "Mon Tableau de bord",
      url: "/dashboard/client",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Mes Colis",
      url: "/dashboard/client/colis",
      icon: Package,
      items: [
        { title: "Envoyer un colis", url: "/dashboard/client/colis/nouveau" },
        { title: "Historique", url: "/dashboard/client/colis/liste" },
      ],
    },
  ],
  [Role.GP]: [
    {
      title: "Gestion GP",
      url: "/dashboard/gp",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Voyages",
      url: "/dashboard/gp/list",
      icon: Package,
    },
    {
      title: "Cargaisons",
      url: "/dashboard/gp/cargaisons",
      icon: Package,
      items: [
        { title: "Arrivages", url: "/dashboard/gp/arrivages" },
        { title: "Clients", url: "/dashboard/gp/clients" },
      ],
    },
  ],
  [Role.GESTIONNAIRE]: [
    {
      title: "Vue d'ensemble",
      url: "/dashboard/gestionnaire",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Voyages",
      url: "/dashboard/gestionnaire/voyages",
      icon: Package,
    },
    {
      title: "Utilisateurs",
      url: "/dashboard/gestionnaire/utilisateurs",
      icon: Users,
      items: [
        { title: "GPs", url: "/dashboard/gestionnaire/gps" },
        { title: "Approbations GP", url: "/dashboard/gestionnaire/gps/approbations" },
        { title: "Clients", url: "/dashboard/gestionnaire/clients" },
      ],
    },
    {
      title: "Support & Litiges",
      url: "/dashboard/gestionnaire/support",
      icon: Headset,
    },
    {
      title: "Parametres",
      url: "/dashboard/gestionnaire/parametres",
      icon: Settings,
    },
  ],
  [Role.ADMIN]: [
    {
      title: "Tableau de bord",
      url:  "/dashboard/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title:  "Tous les GPs",
      url: "/dashboard/gp/list",
      icon:  Users,
    },
    {
      title: "Utilisateurs",
      url: "/dashboard/admin/users",
      icon: Users,
    },
  ],
};

// 2. Mettez à jour les props pour utiliser User
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: Role;
  user: User;
}

export function AppSidebar({
  role: userRole,
  user,
  ...props
}: AppSidebarProps) {
  const userData = {
    name: user.fullName,
    email: user.email,
    avatar: "",
    telephone: user.phone || "", // phone est optionnel dans User, on gère le fallback
  };

  const navMain = navigationMap[userRole] || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 font-bold text-xl text-primary">
          <Package className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">Shipeasy</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
