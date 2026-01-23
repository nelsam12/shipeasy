"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Package } from "lucide-react";
import type { Voyage, StatutVoyage } from "@/types";

interface VoyageCardProps {
  voyage: Voyage;
  onClick?: () => void;
  showContactButton?: boolean;
  onContactGP?: (gpId: number) => void;
}

const STATUT_COLORS: Record<StatutVoyage, "default" | "secondary" | "destructive" | "outline"> = {
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

export function VoyageCard({ voyage, onClick, showContactButton, onContactGP }: VoyageCardProps) {
  const departureDate = new Date(voyage.departureDate);
  const formattedDate = departureDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{voyage.departureLocation.flag}</span>
            <span>{voyage.departureLocation.city}</span>
            <span className="text-muted-foreground">→</span>
            <span>{voyage.arrivalLocation.flag}</span>
            <span>{voyage.arrivalLocation.city}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={STATUT_COLORS[voyage.statut]}>
              {STATUT_LABELS[voyage.statut]}
            </Badge>
            {showContactButton && voyage.gpCourantId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onContactGP?.(voyage.gpCourantId!);
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Date de depart */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>

        {/* Kilos disponibles */}
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>{voyage.availableKilos} kg disponibles</span>
        </div>

        {/* Prix */}
        {voyage.pricePerKg && (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span>{voyage.pricePerKg} FCFA/kg</span>
          </div>
        )}

        {/* Description */}
        {voyage.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {voyage.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
