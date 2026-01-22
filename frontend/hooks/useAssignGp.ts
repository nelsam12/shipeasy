"use client";

import { useState } from "react";
import { assignGpToTrip } from "@/services/trip.service";
import type { Trip } from "@/types";
import { toast } from "sonner";
import { MESSAGES } from "@/lib/constants";

interface UseAssignGpReturn {
  isLoading: boolean;
  error: string | null;
  assignGp: (tripId: number, gpId: number) => Promise<Trip | null>;
}

/**
 * Hook to assign a GP to a trip
 */
export function useAssignGp(): UseAssignGpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignGp = async (tripId: number, gpId: number): Promise<Trip | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await assignGpToTrip(tripId, gpId);
      
      if (response.success && response.data) {
        toast.success(MESSAGES.TRIP.ASSIGN_SUCCESS);
        return response.data;
      } else {
        const errorMsg = response.message || MESSAGES.TRIP.ASSIGN_ERROR;
        setError(errorMsg);
        toast.error(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : MESSAGES.TRIP.ASSIGN_ERROR;
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, assignGp };
}
