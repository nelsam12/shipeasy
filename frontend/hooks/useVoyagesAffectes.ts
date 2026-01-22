import { useState, useEffect } from "react";
import { getVoyagesQuiMeSontAffectes } from "@/services/voyages.service";
import type { Voyage } from "@/types";

export function useVoyagesAffectes() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchVoyagesAffectes() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getVoyagesQuiMeSontAffectes();
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
    fetchVoyagesAffectes();
  }, []);

  return { voyages, isLoading, error, refetch: fetchVoyagesAffectes };
}
