import { useState, useEffect } from "react";
import { getMesReservations } from "@/services/reservation.service";
import type { Reservation } from "@/types";

export function useMesReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMesReservations() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMesReservations();
      setReservations(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement des réservations";
      setError(errorMessage);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMesReservations();
  }, []);

  return { reservations, isLoading, error, refetch: fetchMesReservations };
}
