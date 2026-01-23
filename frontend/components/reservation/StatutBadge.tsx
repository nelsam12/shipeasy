"use client";

import { Badge } from "@/components/ui/badge";
import type { StatutReservation } from "@/types";

interface StatutBadgeProps {
  statut: StatutReservation;
}

const STATUT_COLORS: Record<StatutReservation, "default" | "secondary" | "destructive" | "outline"> = {
  EN_ATTENTE: "outline",
  CONFIRMEE: "default",
  EN_TRANSIT: "secondary",
  LIVREE: "secondary",
  ANNULEE: "destructive",
};

const STATUT_LABELS: Record<StatutReservation, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EN_TRANSIT: "En transit",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export function StatutBadge({ statut }: StatutBadgeProps) {
  return (
    <Badge variant={STATUT_COLORS[statut]}>
      {STATUT_LABELS[statut]}
    </Badge>
  );
}
