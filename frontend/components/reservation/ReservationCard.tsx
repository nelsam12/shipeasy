"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package, MapPin, User, Phone, XCircle } from "lucide-react";
import type { Reservation } from "@/types";
import { StatutBadge } from "./StatutBadge";

interface ReservationCardProps {
  reservation: Reservation;
  onAnnuler?: (id: number) => void;
  isAnnulationLoading?: boolean;
}

export function ReservationCard({
  reservation,
  onAnnuler,
  isAnnulationLoading,
}: ReservationCardProps) {
  const createdDate = new Date(reservation.createdAt);
  const formattedDate = createdDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const peutAnnuler =
    reservation.statut === "EN_ATTENTE" || reservation.statut === "CONFIRMEE";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            Réservation #{reservation.id}
          </CardTitle>
          <StatutBadge statut={reservation.statut} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Date de création */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Créée le:</span>
          <span>{formattedDate}</span>
        </div>

        {/* Poids */}
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{reservation.poidsKg} kg</span>
        </div>

        {/* Description */}
        <div className="text-sm">
          <span className="font-semibold">Description:</span>
          <p className="text-muted-foreground mt-1">{reservation.description}</p>
        </div>

        {/* Adresses */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Enlèvement:</span>
              <p className="text-muted-foreground">{reservation.adresseEnlevement}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Livraison:</span>
              <p className="text-muted-foreground">{reservation.adresseLivraison}</p>
            </div>
          </div>
        </div>

        {/* Destinataire */}
        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Destinataire:</span>
            <span>{reservation.nomDestinataire}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.telephoneDestinataire}</span>
          </div>
        </div>

        {/* Montant */}
        {reservation.montantTotal && (
          <div className="text-sm font-semibold text-primary border-t pt-3">
            Montant total: {reservation.montantTotal.toLocaleString("fr-FR")} FCFA
          </div>
        )}

        {/* Bouton d'annulation */}
        {peutAnnuler && onAnnuler && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-4"
            onClick={() => onAnnuler(reservation.id)}
            disabled={isAnnulationLoading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {isAnnulationLoading ? "Annulation..." : "Annuler la réservation"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
