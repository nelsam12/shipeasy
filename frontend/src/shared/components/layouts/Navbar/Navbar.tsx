'use client';

import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';
import {
  Package,
  User,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { useAuth, useLogout } from '@/src/features/auth/hooks';
import { ROUTES } from '@/src/shared/constants';

export function Navbar() {
  const { user, isLoading } = useAuth();
  const { logout } = useLogout();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SHIPEASY</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href={ROUTES.SEARCH} className="text-sm font-medium">
              Rechercher un GP
            </Link>
            <Link href={ROUTES.DESTINATIONS} className="text-sm font-medium">
              Destinations
            </Link>

            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : !user ? (
              /* Not authenticated */
              <div className="space-x-4">
                <Button variant="ghost" asChild>
                  <Link href={ROUTES.LOGIN}>Connexion</Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.REGISTER}>Créer un compte</Link>
                </Button>
              </div>
            ) : (
              /* Authenticated */
              <div className="flex items-center gap-4">
                <Link
                  href={ROUTES.MESSAGES}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>

                <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">0 PASS</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full border"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      {user?.role && (
                        <Link href={`/dashboard/${user.role.toLowerCase()}`}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Tableau de bord
                        </Link>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.PASS}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Acheter des PASS
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
