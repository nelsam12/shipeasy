import { useState } from "react";
import { annulerReservation } from "@/services/reservation.service";

export function useAnnulerReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function annuler(reservationId: number): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      await annulerReservation(reservationId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'annulation de la réservation";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { annuler, isLoading, error };
}
