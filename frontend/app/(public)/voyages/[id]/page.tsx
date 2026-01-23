"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVoyageById } from "@/services/voyages.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Loader2,
  Package,
  User,
} from "lucide-react";
import type { Voyage, StatutVoyage } from "@/types";
import { Role } from "@/types";

const STATUT_COLORS: Record<
  StatutVoyage,
  "default" | "secondary" | "destructive" | "outline"
> = {
  BROUILLON: "outline",
  PUBLIE: "default",
  AFFECTE: "secondary",
  ANNULE: "destructive",
  TERMINE: "secondary",
};

const STATUT_LABELS: Record<StatutVoyage, string> = {
  BROUILLON: "Brouillon",
  PUBLIE: "Publié",
  AFFECTE: "Affecté",
  ANNULE: "Annulé",
  TERMINE: "Terminé",
};

export default function VoyageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [voyage, setVoyage] = useState<Voyage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVoyage() {
      try {
        const response = await getVoyageById(Number(params.id));
        setVoyage(response.data);
      } catch {
        setError("Voyage introuvable");
      } finally {
        setIsLoading(false);
      }
    }

    fetchVoyage();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !voyage) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  const departureDate = new Date(voyage.departureDate);
  const formattedDate = departureDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const canReserve =
    isAuthenticated &&
    user?.role === Role.CLIENT &&
    (voyage.statut === "PUBLIE" || voyage.statut === "AFFECTE") &&
    voyage.availableKilos > 0;

  function handleReserver() {
    router.push("/dashboard/client/colis/nouveau");
  }

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                <span>{voyage.departureLocation.flag}</span>
                <span>{voyage.departureLocation.city}</span>
                <span className="text-muted-foreground">→</span>
                <span>{voyage.arrivalLocation.flag}</span>
                <span>{voyage.arrivalLocation.city}</span>
              </CardTitle>
              <CardDescription>
                {voyage.departureLocation.country} →{" "}
                {voyage.arrivalLocation.country}
              </CardDescription>
            </div>
            <Badge variant={STATUT_COLORS[voyage.statut]}>
              {STATUT_LABELS[voyage.statut]}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Date de départ */}
          <div className="flex items-start gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Date de départ</p>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          {/* Capacité disponible */}
          <div className="flex items-start gap-4">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Capacité disponible</p>
              <p className="text-muted-foreground">
                {voyage.availableKilos} kg disponibles
              </p>
            </div>
          </div>

          {/* Prix */}
          {voyage.pricePerKg && (
            <div className="flex items-start gap-4">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Prix par kilogramme</p>
                <p className="text-muted-foreground">
                  {voyage.pricePerKg} FCFA/kg
                </p>
              </div>
            </div>
          )}

          {/* GP Créateur */}
          <div className="flex items-start gap-4">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Gestionnaire de parcours</p>
              <p className="text-muted-foreground">GP #{voyage.gpCreateurId}</p>
            </div>
          </div>

          {/* Description */}
          {voyage.description && (
            <div>
              <p className="font-medium mb-2">Description</p>
              <p className="text-muted-foreground whitespace-pre-line">
                {voyage.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Bouton de réservation */}
          {canReserve && (
            <Button className="w-full" size="lg" onClick={handleReserver}>
              Réserver ce voyage
            </Button>
          )}

          {/* Message si non connecté */}
          {!isAuthenticated && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Connectez-vous en tant que client pour réserver ce voyage
              </p>
            </div>
          )}

          {/* Message si capacité nulle */}
          {isAuthenticated &&
            user?.role === Role.CLIENT &&
            voyage.availableKilos === 0 && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Ce voyage n&apos;a plus de capacité disponible
                </p>
              </div>
            )}

          {/* Message si statut non disponible */}
          {isAuthenticated &&
            user?.role === Role.CLIENT &&
            voyage.statut !== "PUBLIE" &&
            voyage.statut !== "AFFECTE" && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Ce voyage n&apos;est pas disponible pour réservation
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
