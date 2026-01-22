import { useState } from "react";
import { affecterGpAVoyage } from "@/services/voyages.service";
import type { AffecterVoyageDto, AffectationVoyage } from "@/types";

export function useAffecterVoyage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function affecter(
    voyageId: number,
    data: AffecterVoyageDto
  ): Promise<AffectationVoyage> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await affecterGpAVoyage(voyageId, data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'affectation";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { affecter, isLoading, error };
}
