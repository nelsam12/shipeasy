import { useState, useEffect } from "react";
import { getAllCountries } from "@/services/location.service";
import type { Country } from "@/services/location.service";

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const data = await getAllCountries();
                setCountries(data);
            } catch (err) {
                setError("Erreur lors du chargement des pays");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCountries();
    }, []);

    return { countries, isLoading, error };
}