"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationSelect } from "./LocationSelect";
import { useCreateTrip } from "@/hooks/useCreateTrip";
import { toast } from "sonner";
import { MESSAGES, ROUTES } from "@/lib/constants";
import type { Location, CreateTripDto } from "@/types";
import { Loader2 } from "lucide-react";

export function CreateTripForm() {
    const router = useRouter();
    const { create, isLoading } = useCreateTrip();

    const [departureLocation, setDepartureLocation] = useState<Location>();
    const [arrivalLocation, setArrivalLocation] = useState<Location>();
    const [departureDate, setDepartureDate] = useState("");
    const [availableKilos, setAvailableKilos] = useState("");
    const [pricePerKg, setPricePerKg] = useState("");
    const [description, setDescription] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    function validateForm(): boolean {
        const newErrors:  Record<string, string> = {};

        if (!departureLocation) {
            newErrors.departureLocation = "Ville de départ requise";
        }

        if (!arrivalLocation) {
            newErrors.arrivalLocation = "Destination requise";
        }

        if (departureLocation && arrivalLocation) {
            if (
                departureLocation.city === arrivalLocation.city &&
                departureLocation.country === arrivalLocation.country
            ) {
                newErrors.arrivalLocation =
                    "La destination doit être différente de la ville de départ";
            }
        }

        if (!departureDate) {
            newErrors.departureDate = "Date de départ requise";
        } else {
            const selectedDate = new Date(departureDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.departureDate = MESSAGES.VALIDATION.DATE_PAST;
            }
        }

        if (!availableKilos || Number(availableKilos) <= 0) {
            newErrors.availableKilos = MESSAGES.VALIDATION.KILOS_POSITIVE;
        }

        if (pricePerKg && Number(pricePerKg) < 0) {
            newErrors.pricePerKg = "Le prix ne peut pas être négatif";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            const data:  CreateTripDto = {
                departureLocation:  departureLocation!,
                arrivalLocation: arrivalLocation!,
                departureDate: new Date(departureDate).toISOString(),
                availableKilos: Number(availableKilos),
                pricePerKg: pricePerKg ?  Number(pricePerKg) : undefined,
                description:  description || undefined,
            };

            await create(data);
            toast.success(MESSAGES.TRIP. CREATE_SUCCESS);
            router.push(ROUTES.DASHBOARD. GP);
        } catch (error) {
            toast.error(MESSAGES.TRIP.CREATE_ERROR);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Itinéraire */}
            <div className="grid gap-3 md:grid-cols-2">
                <LocationSelect
                    label={
                        <>
                            Départ <span className="text-red-500">*</span>
                        </>
                    }
                    value={departureLocation}
                    onChange={setDepartureLocation}
                    error={errors.departureLocation}
                />

                <LocationSelect
                    label={
                        <>
                            Arrivée <span className="text-red-500">*</span>
                        </>
                    }
                    value={arrivalLocation}
                    onChange={setArrivalLocation}
                    error={errors.arrivalLocation}
                />
            </div>

            {/* Date et Kilos */}
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1. 5">
                    <Label htmlFor="departureDate" className="text-sm">
                        Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="departureDate"
                        type="datetime-local"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className={errors.departureDate ? "border-red-500" : ""}
                    />
                    {errors.departureDate && (
                        <p className="text-xs text-red-500">{errors.departureDate}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="availableKilos" className="text-sm">
                        Kilos <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="availableKilos"
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="50"
                        value={availableKilos}
                        onChange={(e) => setAvailableKilos(e.target.value)}
                        className={errors.availableKilos ? "border-red-500" : ""}
                    />
                    {errors.availableKilos && (
                        <p className="text-xs text-red-500">{errors.availableKilos}</p>
                    )}
                </div>
            </div>

            {/* Prix */}
            <div className="space-y-1.5">
                <Label htmlFor="pricePerKg" className="text-sm">
                    Prix/kg <span className="text-xs text-muted-foreground">(optionnel)</span>
                </Label>
                <Input
                    id="pricePerKg"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="5000 FCFA"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target. value)}
                    className={errors. pricePerKg ? "border-red-500" : ""}
                />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm">
                    Description <span className="text-xs text-muted-foreground">(optionnel)</span>
                </Label>
                <Textarea
                    id="description"
                    placeholder="Types de colis acceptés, conditions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                />
            </div>

            {/* Bouton */}
            <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Création...
                    </>
                ) : (
                    "Créer le voyage"
                )}
            </Button>
        </form>
    );
}