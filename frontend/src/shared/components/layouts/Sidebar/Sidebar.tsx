'use client';

import * as React from 'react';
import { LayoutDashboard, Package, Users } from 'lucide-react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/src/shared/components/ui/sidebar';
import { User, Role } from '@/src/features/auth/types';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

const navigationMap: Record<string, NavItem[]> = {
  [Role.CLIENT]: [
    {
      title: 'Mon Tableau de bord',
      url: '/dashboard/client',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Mes Colis',
      url: '/dashboard/client/colis',
      icon: Package,
      items: [
        { title: 'Envoyer un colis', url: '/dashboard/client/colis/nouveau' },
        { title: 'Historique', url: '/dashboard/client/colis/liste' },
      ],
    },
  ],
  [Role.GP]: [
    {
      title: 'Gestion GP',
      url: '/dashboard/gp',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Cargaisons',
      url: '/dashboard/gp/cargaisons',
      icon: Package,
      items: [
        { title: 'Arrivages', url: '/dashboard/gp/arrivages' },
        { title: 'Clients', url: '/dashboard/gp/clients' },
      ],
    },
  ],
  [Role.GESTIONNAIRE]: [
    {
      title: "Vue d'ensemble",
      url: '/dashboard/gestionnaire',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Utilisateurs',
      url: '/dashboard/gestionnaire/utilisateurs',
      icon: Users,
      items: [
        { title: 'Validation GP', url: '/dashboard/gestionnaire/approbations' },
        { title: 'Liste Clients', url: '/dashboard/gestionnaire/clients' },
      ],
    },
    {
      title: 'Litiges & Support',
      url: '/dashboard/gestionnaire/support',
      icon: Package,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: Role;
  user: User;
}

export function AppSidebar({ role: userRole, user, ...props }: AppSidebarProps) {
  const userData = {
    name: user.fullName,
    email: user.email,
    avatar: '',
    telephone: user.phone || '',
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
