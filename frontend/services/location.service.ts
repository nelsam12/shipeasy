export interface Country {
    name: string;
    code: string; // ISO 2 (ex: SN, FR)
    flag: string;
}

export interface City {
    name: string;
    country: string;
    countryCode: string;
}

/**
 * Get all countries with flags
 * Uses REST Countries API (free, no API key needed)
 */
export async function getAllCountries(): Promise<Country[]> {
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,cca2,flag"
        );
        const data = await response.json();

        return data
            .map((country: any) => ({
                name: country.name.common,
                code: country.cca2,
                flag: country. flag, // Emoji flag
            }))
            .sort((a:  Country, b: Country) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
}

/**
 * Search cities by name in a specific country
 */
export async function searchCitiesInCountry(
    query: string,
    countryCode: string
): Promise<City[]> {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const username = process.env.NEXT_PUBLIC_GEONAMES_USERNAME || "demo";

        const response = await fetch(
            `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
                query
            )}&country=${countryCode}&maxRows=20&username=${username}&featureClass=P&orderby=population`
        );

        const data = await response.json();

        if (! data.geonames) {
            return [];
        }

        return data.geonames.map((city: any) => ({
            name: city.name,
            country: city.countryName,
            countryCode: city.countryCode,
        }));
    } catch (error) {
        console.error("Error searching cities:", error);
        return [];
    }
}

/**
 * Search cities by name (all countries)
 */
export async function searchCities(query: string): Promise<City[]> {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const username = process.env.NEXT_PUBLIC_GEONAMES_USERNAME || "demo";

        const response = await fetch(
            `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
                query
            )}&maxRows=20&username=${username}&featureClass=P&orderby=population`
        );

        const data = await response.json();

        if (!data.geonames) {
            return [];
        }

        return data.geonames.map((city: any) => ({
            name: city. name,
            country: city. countryName,
            countryCode: city.countryCode,
        }));
    } catch (error) {
        console.error("Error searching cities:", error);
        return [];
    }
}

/**
 * Get popular cities (fallback when no search)
 */
export function getPopularCities(): City[] {
    return [
        { name: "Paris", country: "France", countryCode: "FR" },
        { name: "Lyon", country: "France", countryCode: "FR" },
        { name: "Marseille", country: "France", countryCode: "FR" },
        { name: "Toulouse", country:  "France", countryCode: "FR" },
        { name:  "Nice", country: "France", countryCode: "FR" },
        { name: "Dakar", country: "Senegal", countryCode: "SN" },
        { name:  "Abidjan", country:  "Côte d'Ivoire", countryCode: "CI" },
        { name: "Lomé", country: "Togo", countryCode: "TG" },
        { name: "Cotonou", country: "Benin", countryCode: "BJ" },
        { name:  "Bamako", country: "Mali", countryCode: "ML" },
        { name: "Conakry", country: "Guinea", countryCode: "GN" },
        { name: "Ouagadougou", country: "Burkina Faso", countryCode: "BF" },
        { name: "Niamey", country: "Niger", countryCode: "NE" },
        { name: "Bruxelles", country: "Belgium", countryCode: "BE" },
        { name: "Londres", country: "United Kingdom", countryCode: "GB" },
        { name: "New York", country: "United States", countryCode: "US" },
        { name: "Montréal", country: "Canada", countryCode: "CA" },
        { name: "Dubaï", country: "United Arab Emirates", countryCode: "AE" },
    ];
}

/**
 * Get country flag emoji by ISO code
 */
export function getFlagEmoji(countryCode:  string): string {
    if (! countryCode || countryCode.length !== 2) return "🌍";

    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char. charCodeAt(0));

    return String.fromCodePoint(...codePoints);
}

/**
 * Get country name by code from a list of countries
 */
export function getCountryByCode(
    countries: Country[],
    code: string
): Country | undefined {
    return countries. find((c) => c.code === code);
}