import { useState } from "react";
import { changeStatutVoyage } from "@/services/voyages.service";
import type { ChangeStatutVoyageDto, Voyage } from "@/types";

export function useChangeStatutVoyage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatut(
    voyageId: number,
    data: ChangeStatutVoyageDto
  ): Promise<Voyage> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await changeStatutVoyage(voyageId, data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification du statut";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { changeStatut, isLoading, error };
}
