"use client";

import { useState } from "react";
import { useVoyages } from "@/hooks/useVoyages";
import { useGPs } from "@/hooks/useGPs";
import { useAffecterVoyage } from "@/hooks/useAffecterVoyage";
import { useChangeStatutVoyage } from "@/hooks/useChangeStatutVoyage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Search, Plane, UserPlus, Calendar, Package } from "lucide-react";
import { StatutVoyage, Voyage } from "@/types";
import { toast } from "sonner";
import { MESSAGES } from "@/lib/constants";

const STATUT_COLORS: Record<StatutVoyage, "default" | "secondary" | "destructive" | "outline"> = {
  BROUILLON: "outline",
  PUBLIE: "default",
  AFFECTE: "secondary",
  ANNULE: "destructive",
  TERMINE: "secondary",
};

const STATUT_LABELS: Record<StatutVoyage, string> = {
  BROUILLON: "Brouillon",
  PUBLIE: "Publie",
  AFFECTE: "Affecte",
  ANNULE: "Annule",
  TERMINE: "Termine",
};

export default function GestionnaireVoyagesPage() {
  const { voyages, isLoading, error, refetch } = useVoyages();
  const { gps, isLoading: isLoadingGPs } = useGPs();
  const { affecter, isLoading: isAffecting } = useAffecterVoyage();
  const { changeStatut, isLoading: isChangingStatut } = useChangeStatutVoyage();

  const [statutFilter, setStatutFilter] = useState<string>("all");
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [isAffectationDialogOpen, setIsAffectationDialogOpen] = useState(false);
  const [selectedGpId, setSelectedGpId] = useState<string>("");
  const [note, setNote] = useState("");

  function handleSearch() {
    refetch({
      statut: statutFilter === "all" ? undefined : (statutFilter as StatutVoyage),
    });
  }

  function handleReset() {
    setStatutFilter("all");
    refetch();
  }

  function openAffectationDialog(voyage: Voyage) {
    setSelectedVoyage(voyage);
    setSelectedGpId("");
    setNote("");
    setIsAffectationDialogOpen(true);
  }

  async function handleAffectation() {
    if (!selectedVoyage || !selectedGpId) {
      toast.error("Veuillez selectionner un GP");
      return;
    }

    try {
      await affecter(selectedVoyage.id, {
        gpId: Number(selectedGpId),
        note: note || undefined,
      });
      toast.success(MESSAGES.VOYAGE.AFFECTER_SUCCESS);
      setIsAffectationDialogOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'affectation";
      toast.error(errorMessage);
    }
  }

  async function handleChangeStatut(voyageId: number, newStatut: StatutVoyage) {
    try {
      await changeStatut(voyageId, { statut: newStatut });
      toast.success(MESSAGES.VOYAGE.CHANGE_STATUT_SUCCESS);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la modification du statut";
      toast.error(errorMessage);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement des voyages...</p>
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
            Reessayer
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
          Consultez et gerez tous les voyages de la plateforme
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtre statut */}
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={StatutVoyage.BROUILLON}>Brouillon</SelectItem>
                <SelectItem value={StatutVoyage.PUBLIE}>Publie</SelectItem>
                <SelectItem value={StatutVoyage.AFFECTE}>Affecte</SelectItem>
                <SelectItem value={StatutVoyage.ANNULE}>Annule</SelectItem>
                <SelectItem value={StatutVoyage.TERMINE}>Termine</SelectItem>
              </SelectContent>
            </Select>

            {/* Boutons actions */}
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des voyages */}
      {voyages.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Aucun voyage trouve</p>
              <p className="text-sm text-muted-foreground">
                {statutFilter !== "all"
                  ? "Essayez de modifier vos criteres de recherche"
                  : "Aucun voyage n'est encore cree dans le systeme"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resume */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {voyages.length} voyage{voyages.length > 1 ? "s" : ""} trouve
              {voyages.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Grille de cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {voyages.map((voyage) => (
              <Card key={voyage.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{voyage.departureLocation.flag}</span>
                      <span>{voyage.departureLocation.city}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{voyage.arrivalLocation.flag}</span>
                      <span>{voyage.arrivalLocation.city}</span>
                    </CardTitle>
                    <Badge variant={STATUT_COLORS[voyage.statut]}>
                      {STATUT_LABELS[voyage.statut]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Infos voyage */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(voyage.departureDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{voyage.availableKilos} kg disponibles</span>
                    </div>
                    {voyage.pricePerKg && (
                      <div className="text-sm font-semibold text-primary">
                        {voyage.pricePerKg} FCFA/kg
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* Changer statut */}
                    <div className="space-y-1">
                      <Label className="text-xs">Changer le statut</Label>
                      <Select
                        value={voyage.statut}
                        onValueChange={(value) =>
                          handleChangeStatut(voyage.id, value as StatutVoyage)
                        }
                        disabled={isChangingStatut}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={StatutVoyage.BROUILLON}>Brouillon</SelectItem>
                          <SelectItem value={StatutVoyage.PUBLIE}>Publie</SelectItem>
                          <SelectItem value={StatutVoyage.AFFECTE}>Affecte</SelectItem>
                          <SelectItem value={StatutVoyage.ANNULE}>Annule</SelectItem>
                          <SelectItem value={StatutVoyage.TERMINE}>Termine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Affecter GP */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => openAffectationDialog(voyage)}
                    >
                      <UserPlus className="mr-2 h-3 w-3" />
                      {voyage.gpCourantId ? "Reassigner GP" : "Affecter GP"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Dialog d'affectation */}
      <Dialog open={isAffectationDialogOpen} onOpenChange={setIsAffectationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affecter un GP</DialogTitle>
            <DialogDescription>
              Selectionnez un GP pour l&apos;affecter a ce voyage
            </DialogDescription>
          </DialogHeader>

          {selectedVoyage && (
            <div className="space-y-4">
              {/* Info voyage */}
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">
                  {selectedVoyage.departureLocation.city} → {selectedVoyage.arrivalLocation.city}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(selectedVoyage.departureDate).toLocaleDateString("fr-FR")}
                </p>
              </div>

              {/* Selectionner GP */}
              <div className="space-y-2">
                <Label>GP *</Label>
                {isLoadingGPs ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement des GPs...
                  </div>
                ) : approvedGps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun GP approuve disponible
                  </p>
                ) : (
                  <Select value={selectedGpId} onValueChange={setSelectedGpId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un GP" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedGps.map((gp) => (
                        <SelectItem key={gp.id} value={gp.id.toString()}>
                          {gp.fullName} ({gp.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label>Note (optionnelle)</Label>
                <Textarea
                  placeholder="Ajoutez une note pour le GP..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAffectationDialogOpen(false)}
              disabled={isAffecting}
            >
              Annuler
            </Button>
            <Button onClick={handleAffectation} disabled={isAffecting}>
              {isAffecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Affectation...
                </>
              ) : (
                "Affecter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
