"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {getTripById} from "@/services/trip.service";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {ArrowLeft, Calendar, DollarSign, Loader2, Package,} from "lucide-react";
import type {Trip} from "@/types";

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTrip() {
            try {
                const response = await getTripById(Number(params.id));
                setTrip(response.data);
            } catch (err) {
                setError("Voyage introuvable");
            } finally {
                setIsLoading(false);
            }
        }

        fetchTrip();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="container py-10">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => router.back()}>Retour</Button>
                </div>
            </div>
        );
    }

    const departureDate = new Date(trip.departureDate);
    const formattedDate = departureDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="container max-w-4xl py-10">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Retour
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                                <span>{trip.departureLocation.flag}</span>
                                <span>{trip.departureLocation.city}</span>
                                <span className="text-muted-foreground">→</span>
                                <span>{trip.arrivalLocation.flag}</span>
                                <span>{trip.arrivalLocation.city}</span>
                            </CardTitle>
                            <CardDescription>
                                {trip.departureLocation.country} → {trip.arrivalLocation.country}
                            </CardDescription>
                        </div>
                        <Badge
                            variant={trip.status === "ACTIVE" ? "default" : "secondary"}
                        >
                            {trip.status === "ACTIVE" ? "Actif" : trip.status}
                        </Badge>
                    </div>
                </CardHeader>

                <Separator/>

                <CardContent className="pt-6 space-y-6">
                    {/* Date de départ */}
                    <div className="flex items-start gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5"/>
                        <div>
                            <p className="font-medium">Date de départ</p>
                            <p className="text-muted-foreground">{formattedDate}</p>
                        </div>
                    </div>

                    {/* Kilos disponibles */}
                    <div className="flex items-start gap-4">
                        <Package className="h-5 w-5 text-muted-foreground mt-0.5"/>
                        <div>
                            <p className="font-medium">Capacité disponible</p>
                            <p className="text-muted-foreground">
                                {trip.availableKilos} kg disponibles
                            </p>
                        </div>
                    </div>

                    {/* Prix */}
                    {trip.pricePerKg && (
                        <div className="flex items-start gap-4">
                            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5"/>
                            <div>
                                <p className="font-medium">Prix par kilogramme</p>
                                <p className="text-muted-foreground">
                                    {trip.pricePerKg} FCFA/kg
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {trip.description && (
                        <div>
                            <p className="font-medium mb-2">Description</p>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {trip.description}
                            </p>
                        </div>
                    )}

                    <Separator/>

                    {/* Action button */}
                    {trip.status === "ACTIVE" && (
                        <Button className="w-full" size="lg">
                            Réserver de l'espace
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}