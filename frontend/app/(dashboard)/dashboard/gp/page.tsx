"use client";

import { useMyTrips } from "@/hooks/useMyTrips";
import { TripCard } from "@/components/trip/TripCard";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GPDashboardPage() {
    const { trips, isLoading, error } = useMyTrips();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-10">
                <div className="text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mes voyages</h1>
                    <p className="text-muted-foreground">
                        Gérez vos voyages et suivez vos réservations
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/gp/create-trip">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau voyage
                    </Link>
                </Button>
            </div>

            {trips.length === 0 ?  (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        {"Vous n'avez pas encore créé de voyage"}
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/gp/create-trip">
                            Créer mon premier voyage
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onClick={() => router.push(`/trips/${trip.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}