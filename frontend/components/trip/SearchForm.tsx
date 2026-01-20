"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LocationSelect} from "./LocationSelect";
import {Search} from "lucide-react";
import type {Location, SearchTripsQuery} from "@/types";

interface SearchFormProps {
    onSearch: (query: SearchTripsQuery) => void;
    isLoading?: boolean;
}

export function SearchForm({onSearch, isLoading}: SearchFormProps) {
    const [departureLocation, setDepartureLocation] = useState<Location>();
    const [arrivalLocation, setArrivalLocation] = useState<Location>();
    const [departureDate, setDepartureDate] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const query: SearchTripsQuery = {
            departureCity: departureLocation?.city,
            arrivalCity: arrivalLocation?.city,
            departureDate: departureDate
                ? new Date(departureDate).toISOString()
                : undefined,
        };

        onSearch(query);
    }

    function handleReset() {
        setDepartureLocation(undefined);
        setArrivalLocation(undefined);
        setDepartureDate("");
        onSearch({});
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md: grid-cols-2">
                {/* Ville de départ */}
                <LocationSelect
                    label="Ville de départ"
                    value={departureLocation}
                    onChange={setDepartureLocation}
                />

                {/* Destination */}
                <LocationSelect
                    label="Destination"
                    value={arrivalLocation}
                    onChange={setArrivalLocation}
                />
            </div>

            {/* Date de départ */}
            <div className="space-y-2">
                <Label htmlFor="searchDate">Date de départ (optionnel)</Label>
                <Input
                    id="searchDate"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                />
            </div>

            <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Search className="mr-2 h-4 w-4"/>
                    {isLoading ? "Recherche..." : "Rechercher"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading}
                >
                    Réinitialiser
                </Button>
            </div>
        </form>
    );
}