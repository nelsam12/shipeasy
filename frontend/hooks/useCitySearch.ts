import { useState, useEffect } from "react";
import { searchCities, getPopularCities } from "@/services/location.service";
import type { City } from "@/services/location.service";

export function useCitySearch(query: string) {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query || query.length < 2) {
            // Show popular cities when no search
            setCities(getPopularCities());
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await searchCities(query);
                setCities(results);
            } catch (error) {
                console.error("Search error:", error);
                setCities(getPopularCities()); // Fallback to popular cities
            } finally {
                setIsLoading(false);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [query]);

    return { cities, isLoading };
}