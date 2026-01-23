"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { Role } from "@/types";
import { useMesReservations } from "@/hooks/useMesReservations";
import { useAnnulerReservation } from "@/hooks/useAnnulerReservation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PackageX, Plus } from "lucide-react";
import Link from "next/link";
import { ReservationCard } from "@/components/reservation/ReservationCard";
import { StatutReservation } from "@/types";
import { toast } from "sonner";
import { MESSAGES } from "@/lib/constants";
import { useState } from "react";

export default function ListeColisPage() {
  const { reservations, isLoading, error, refetch } = useMesReservations();
  const { annuler, isLoading: isAnnulationLoading } = useAnnulerReservation();
  const [annulationId, setAnnulationId] = useState<number | null>(null);

  async function handleAnnuler(id: number) {
    setAnnulationId(id);
    try {
      await annuler(id);
      toast.success(MESSAGES.RESERVATION.CANCEL_SUCCESS);
      refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : MESSAGES.RESERVATION.CANCEL_ERROR;
      toast.error(errorMessage);
    } finally {
      setAnnulationId(null);
    }
  }

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

  // Filtrer les réservations par statut
  const reservationsActives = reservations.filter(
    (r) =>
      r.statut === StatutReservation.EN_ATTENTE ||
      r.statut === StatutReservation.CONFIRMEE ||
      r.statut === StatutReservation.EN_TRANSIT
  );
  const reservationsTerminees = reservations.filter(
    (r) => r.statut === StatutReservation.LIVREE
  );
  const reservationsAnnulees = reservations.filter(
    (r) => r.statut === StatutReservation.ANNULEE
  );

  return (
    <RoleGuard role={Role.CLIENT}>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes réservations</h1>
            <p className="text-muted-foreground">
              Consultez et gérez vos réservations de colis
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/client/colis/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle réservation
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="actives" className="space-y-6">
          <TabsList className="grid w-full max-w-[500px] grid-cols-3">
            <TabsTrigger value="actives">
              Actives ({reservationsActives.length})
            </TabsTrigger>
            <TabsTrigger value="terminees">
              Livrées ({reservationsTerminees.length})
            </TabsTrigger>
            <TabsTrigger value="annulees">
              Annulées ({reservationsAnnulees.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actives" className="space-y-4">
            {reservationsActives.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Aucune réservation active
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous n&apos;avez pas de réservation en cours
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/client/colis/nouveau">
                        Créer une réservation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reservationsActives.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onAnnuler={handleAnnuler}
                    isAnnulationLoading={
                      isAnnulationLoading && annulationId === reservation.id
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="terminees" className="space-y-4">
            {reservationsTerminees.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Aucune réservation livrée
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vos réservations livrées apparaîtront ici
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reservationsTerminees.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="annulees" className="space-y-4">
            {reservationsAnnulees.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Aucune réservation annulée
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vos réservations annulées apparaîtront ici
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reservationsAnnulees.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}
