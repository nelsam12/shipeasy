import { useState } from "react";
import { createVoyage } from "@/services/voyages.service";
import type { CreateVoyageDto, Voyage } from "@/types";

export function useCreateVoyage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: CreateVoyageDto): Promise<Voyage> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createVoyage(data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la création du voyage";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { create, isLoading, error };
}
