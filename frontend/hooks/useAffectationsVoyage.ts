import { useState, useEffect } from "react";
import { getAffectationsVoyage } from "@/services/voyages.service";
import type { AffectationVoyage } from "@/types";

export function useAffectationsVoyage(voyageId: number) {
  const [affectations, setAffectations] = useState<AffectationVoyage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAffectations() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAffectationsVoyage(voyageId);
      setAffectations(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      setAffectations([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (voyageId) {
      fetchAffectations();
    }
  }, [voyageId]);

  return { affectations, isLoading, error, refetch: fetchAffectations };
}
