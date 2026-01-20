"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Calendar, DollarSign, Package} from "lucide-react";
import type {Trip} from "@/types";

interface TripCardProps {
    trip: Trip;
    onClick?: () => void;
}

export function TripCard({trip, onClick}: TripCardProps) {
    const departureDate = new Date(trip.departureDate);
    const formattedDate = departureDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span>{trip.departureLocation.flag}</span>
                        <span>{trip.departureLocation.city}</span>
                        <span className="text-muted-foreground">→</span>
                        <span>{trip.arrivalLocation.flag}</span>
                        <span>{trip.arrivalLocation.city}</span>
                    </CardTitle>
                    <Badge
                        variant={trip.status === "ACTIVE" ? "default" : "secondary"}
                    >
                        {trip.status === "ACTIVE" ? "Actif" : trip.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Date de départ */}
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                    <span>{formattedDate}</span>
                </div>

                {/* Kilos disponibles */}
                <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground"/>
                    <span>{trip.availableKilos} kg disponibles</span>
                </div>

                {/* Prix */}
                {trip.pricePerKg && (
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                        <span>{trip.pricePerKg} FCFA/kg</span>
                    </div>
                )}

                {/* Description */}
                {trip.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {trip.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}