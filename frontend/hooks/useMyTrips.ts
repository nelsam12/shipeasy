import { useState, useEffect } from "react";
import { getMyTrips } from "@/services/trip.service";
import type { Trip } from "@/types";

export function useMyTrips() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchMyTrips() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getMyTrips();
            setTrips(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erreur lors du chargement";
            setError(errorMessage);
            setTrips([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMyTrips();
    }, []);

    return { trips, isLoading, error, refetch: fetchMyTrips };
}