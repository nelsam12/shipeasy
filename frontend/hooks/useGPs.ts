import { useState, useEffect } from "react";
import { getGPs } from "@/services/gp.service";
import { GetGPsQuery, GP } from "@/types/gp.type";

export function useGPs() {
    const [gps, setGps] = useState<GP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchGPs(query?: GetGPsQuery) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getGPs(query);
            setGps(response.data);
        } catch (err) {
            setError("Erreur lors du chargement des GPs");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGPs();
    }, []);

    return {
        gps,
        isLoading,
        error,
        refetch: fetchGPs,
    };
}