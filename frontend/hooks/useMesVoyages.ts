import { useState, useEffect } from "react";
import { getMesVoyages } from "@/services/voyages.service";
import type { Voyage } from "@/types";

export function useMesVoyages() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMesVoyages() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMesVoyages();
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
    fetchMesVoyages();
  }, []);

  return { voyages, isLoading, error, refetch: fetchMesVoyages };
}
