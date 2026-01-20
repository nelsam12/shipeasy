import { useState, useEffect } from "react";
import { searchTrips, getActiveTrips } from "@/services/trip.service";
import type { Trip, SearchTripsQuery } from "@/types";

export function useSearchTrips(initialQuery?:  SearchTripsQuery) {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function search(query?:  SearchTripsQuery) {
        setIsLoading(true);
        setError(null);

        try {
            const response = query && (query.departureCity || query.arrivalCity || query.departureDate)
                ? await searchTrips(query)
                : await getActiveTrips();

            setTrips(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message :  "Erreur lors de la recherche";
            setError(errorMessage);
            setTrips([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        search(initialQuery);
    }, []);

    return { trips, isLoading, error, search };
}