"use client";

import { useState } from "react";
import { useAllTrips } from "@/hooks/useAllTrips";
import { useGPs } from "@/hooks/useGPs";
import { useAssignGp } from "@/hooks/useAssignGp";
import { TripCard } from "@/components/trip/TripCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCw, Search, UserPlus } from "lucide-react";
import type { Trip } from "@/types";

export default function GestionnaireVoyagesPage() {
  const { trips, isLoading, error, refetch } = useAllTrips();
  const { gps, isLoading: gpsLoading } = useGPs();
  const { assignGp, isLoading: isAssigning } = useAssignGp();
  const [search, setSearch] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [selectedGpId, setSelectedGpId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssignGp = async () => {
    if (!selectedTripId || !selectedGpId) return;

    const result = await assignGp(selectedTripId, Number(selectedGpId));
    if (result) {
      setIsDialogOpen(false);
      setSelectedTripId(null);
      setSelectedGpId("");
      refetch();
    }
  };

  const handleOpenDialog = (tripId: number) => {
    setSelectedTripId(tripId);
    setSelectedGpId("");
    setIsDialogOpen(true);
  };

  const filteredTrips = trips.filter((trip) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      trip.departureLocation.city.toLowerCase().includes(searchLower) ||
      trip.arrivalLocation.city.toLowerCase().includes(searchLower) ||
      trip.description?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Chargement des voyages...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const approvedGps = gps.filter((gp) => gp.isApproved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestion des voyages</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et gérez tous les voyages de la plateforme
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par ville de départ, d'arrivée ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSearch("")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des voyages */}
      {filteredTrips.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Aucun voyage trouvé</p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucun voyage n'est encore créé dans le système"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTrips.length} voyage{filteredTrips.length > 1 ? "s" : ""}{" "}
              trouvé
              {filteredTrips.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="relative">
                <TripCard trip={trip} />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => handleOpenDialog(trip.id)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assigner un GP
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dialog d'assignation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un GP au voyage</DialogTitle>
            <DialogDescription>
              Sélectionnez un GP approuvé pour ce voyage
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {gpsLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
              </div>
            ) : approvedGps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                Aucun GP approuvé disponible
              </p>
            ) : (
              <Select value={selectedGpId} onValueChange={setSelectedGpId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un GP" />
                </SelectTrigger>
                <SelectContent>
                  {approvedGps.map((gp) => (
                    <SelectItem key={gp.id} value={String(gp.id)}>
                      {gp.fullName} - {gp.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isAssigning}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAssignGp}
              disabled={!selectedGpId || isAssigning}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assignation...
                </>
              ) : (
                "Assigner"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
