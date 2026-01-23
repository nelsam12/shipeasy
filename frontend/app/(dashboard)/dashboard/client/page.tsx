"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { Role } from "@/types";
import { useMesReservations } from "@/hooks/useMesReservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, PackageCheck, PackageX, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { ReservationCard } from "@/components/reservation/ReservationCard";
import { StatutReservation } from "@/types";

export default function ClientDashboardPage() {
  const { reservations, isLoading, error } = useMesReservations();

  if (isLoading) {
    return (
      <RoleGuard role={Role.CLIENT}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard role={Role.CLIENT}>
        <div className="container py-10">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // Calcul des statistiques
  const stats = {
    total: reservations.length,
    enAttente: reservations.filter((r) => r.statut === StatutReservation.EN_ATTENTE).length,
    confirmees: reservations.filter((r) => r.statut === StatutReservation.CONFIRMEE).length,
    enTransit: reservations.filter((r) => r.statut === StatutReservation.EN_TRANSIT).length,
    livrees: reservations.filter((r) => r.statut === StatutReservation.LIVREE).length,
    annulees: reservations.filter((r) => r.statut === StatutReservation.ANNULEE).length,
  };

  // Les 3 réservations les plus récentes
  const reservationsRecentes = reservations.slice(0, 3);

  return (
    <RoleGuard role={Role.CLIENT}>
      <div className="container py-10 space-y-8">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace client
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/client/colis/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle réservation
            </Link>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total réservations
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En attente
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enAttente}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En transit
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.confirmees + stats.enTransit}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Livrées
              </CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.livrees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Réservations récentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Réservations récentes</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/client/colis/liste">
                Voir tout
              </Link>
            </Button>
          </div>

          {reservationsRecentes.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Aucune réservation
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vous n&apos;avez pas encore créé de réservation
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/client/colis/nouveau">
                      Créer ma première réservation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reservationsRecentes.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
