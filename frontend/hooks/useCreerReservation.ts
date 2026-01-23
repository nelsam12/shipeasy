import { useState } from "react";
import { creerReservation } from "@/services/reservation.service";
import type { CreerReservationDto, Reservation } from "@/types";

export function useCreerReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function creer(data: CreerReservationDto): Promise<Reservation> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await creerReservation(data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la création de la réservation";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { creer, isLoading, error };
}
