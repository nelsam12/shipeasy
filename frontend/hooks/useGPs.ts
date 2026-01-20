import { useState, useEffect } from "react";
import { getGPs, getGPsStats } from "@/services/gp.service";
import {GetGPsQuery, GP, GPsStats} from "@/types/gp.type";

export function useGPs() {
    const [gps, setGps] = useState<GP[]>([]);
    const [stats, setStats] = useState<GPsStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchGPs(query?: GetGPsQuery) {
        setIsLoading(true);
        setError(null);

        try {
            const [gpsResponse, statsResponse] = await Promise. all([
                getGPs(query),
                getGPsStats(),
            ]);

            setGps(gpsResponse.data);
            setStats(statsResponse.data);
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
        stats,
        isLoading,
        error,
        refetch: fetchGPs,
    };
}