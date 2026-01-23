"use client";

import { useState, useEffect } from "react";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { Role } from "@/types";
import { useVoyages } from "@/hooks/useVoyages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VoyageCard } from "@/components/voyage/VoyageCard";
import { FormulaireReservation } from "@/components/reservation/FormulaireReservation";
import { Loader2, PackageX } from "lucide-react";
import type { Voyage } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function NouveauColisPage() {
  const { voyages, isLoading, error } = useVoyages();
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pré-sélectionner le voyage si voyageId est dans l'URL
  useEffect(() => {
    const voyageIdParam = searchParams.get('voyageId');
    if (voyageIdParam && voyages.length > 0 && !selectedVoyage) {
      const preselectedVoyage = voyages.find(v => v.id === parseInt(voyageIdParam, 10));
      if (preselectedVoyage) {
        setSelectedVoyage(preselectedVoyage);
        setIsDialogOpen(true);
      }
    }
  }, [searchParams, voyages, selectedVoyage]);

  function handleSelectVoyage(voyage: Voyage) {
    setSelectedVoyage(voyage);
    setIsDialogOpen(true);
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedVoyage(null);
    router.push("/dashboard/client/colis/liste");
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

  // Filtrer uniquement les voyages publiés ou affectés
  const voyagesDisponibles = voyages.filter(
    (v) => v.statut === "PUBLIE" || v.statut === "AFFECTE"
  );

  return (
    <RoleGuard role={Role.CLIENT}>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Créer une réservation</h1>
          <p className="text-muted-foreground">
            Sélectionnez un voyage et créez votre réservation de colis
          </p>
        </div>

        {voyagesDisponibles.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  Aucun voyage disponible
                </p>
                <p className="text-sm text-muted-foreground">
                  Il n&apos;y a pas de voyage disponible pour le moment
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {voyagesDisponibles.length} voyage
                {voyagesDisponibles.length > 1 ? "s" : ""} disponible
                {voyagesDisponibles.length > 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {voyagesDisponibles.map((voyage) => (
                <div key={voyage.id} className="relative">
                  <VoyageCard voyage={voyage} />
                  <Button
                    className="w-full mt-2"
                    onClick={() => handleSelectVoyage(voyage)}
                  >
                    Réserver ce voyage
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Dialog pour le formulaire de réservation */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une réservation</DialogTitle>
            </DialogHeader>
            {selectedVoyage && (
              <div className="space-y-4">
                {/* Informations du voyage sélectionné */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Voyage sélectionné</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span>{selectedVoyage.departureLocation.flag}</span>
                      <span>{selectedVoyage.departureLocation.city}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{selectedVoyage.arrivalLocation.flag}</span>
                      <span>{selectedVoyage.arrivalLocation.city}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Capacité disponible:</span>{" "}
                      {selectedVoyage.availableKilos} kg
                    </div>
                    {selectedVoyage.pricePerKg && (
                      <div>
                        <span className="font-semibold">Prix:</span>{" "}
                        {selectedVoyage.pricePerKg} FCFA/kg
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Formulaire de réservation */}
                <FormulaireReservation
                  voyageId={selectedVoyage.id}
                  capaciteDisponible={selectedVoyage.availableKilos}
                  onSuccess={handleSuccess}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
