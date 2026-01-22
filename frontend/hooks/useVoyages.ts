import { useState, useEffect } from "react";
import { getAllVoyages } from "@/services/voyages.service";
import type { Voyage, SearchVoyagesQuery } from "@/types";

export function useVoyages(initialFilters?: SearchVoyagesQuery) {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchVoyages(filters?: SearchVoyagesQuery) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllVoyages(filters);
      setVoyages(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      setVoyages([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVoyages(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { voyages, isLoading, error, refetch: fetchVoyages };
}
