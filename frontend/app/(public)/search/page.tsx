"use client";

import { useState } from "react";
import { useSearchTrips } from "@/hooks/useSearchTrips";
import { SearchForm } from "@/components/trip/SearchForm";
import { TripCard } from "@/components/trip/TripCard";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SearchTripsQuery } from "@/types";

export default function SearchPage() {
    const { trips, isLoading, search } = useSearchTrips();
    const router = useRouter();
    const [hasSearched, setHasSearched] = useState(false);

    function handleSearch(query: SearchTripsQuery) {
        setHasSearched(true);
        search(query);
    }

    return (
        <div className="container py-10">
            <div className="max-w-4xl mx-auto mb-12">
                <h1 className="text-3xl font-bold mb-2">Rechercher un voyage</h1>
                <p className="text-muted-foreground mb-8">
                    Trouvez le voyage qui correspond à vos besoins
                </p>

                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            <div className="max-w-6xl mx-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {hasSearched
                                ? "Aucun voyage trouvé pour ces critères"
                                : "Aucun voyage disponible pour le moment"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                {trips.length} voyage{trips.length > 1 ? "s" : ""} trouvé
                                {trips.length > 1 ? "s" : ""}
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onClick={() => router.push(`/trips/${trip.id}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}