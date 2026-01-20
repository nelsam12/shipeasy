import { useState } from "react";
import { createTrip } from "@/services/trip.service";
import type { CreateTripDto, Trip } from "@/types";

export function useCreateTrip() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function create(data: CreateTripDto): Promise<Trip> {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createTrip(data);
            return response.data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err. message : "Erreur lors de la création du voyage";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { create, isLoading, error };
}