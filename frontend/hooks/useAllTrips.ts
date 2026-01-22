"use client";

import { useState, useEffect } from "react";
import { getAllTrips } from "@/services/trip.service";
import type { Trip } from "@/types";

interface UseAllTripsReturn {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all trips (for GESTIONNAIRE/ADMIN)
 */
export function useAllTrips(): UseAllTripsReturn {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllTrips();
      
      if (response.success && response.data) {
        setTrips(response.data);
      } else {
        setError(response.message || "Erreur lors du chargement des voyages");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur lors du chargement des voyages";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    isLoading,
    error,
    refetch: fetchTrips,
  };
}
