"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCitySearch } from "@/hooks/useCitySearch";
import { getFlagEmoji } from "@/services/location.service";
import type { Location } from "@/types";

interface LocationSelectProps {
    label:  React.ReactNode;
    value?:  Location;
    onChange:  (location: Location) => void;
    error?: string;
    placeholder?: string;
}

export function LocationSelect({
                                   label,
                                   value,
                                   onChange,
                                   error,
                                   placeholder = "Rechercher une ville...",
                               }: LocationSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cities, isLoading } = useCitySearch(searchQuery);

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between h-auto min-h-10 py-2",
                            ! value && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                    >
                        {value ?  (
                            <span className="flex items-center gap-2">
                <span className="text-xl">{value.flag}</span>
                <span className="font-medium">{value.city}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">
                  {value.country}
                </span>
              </span>
                        ) : (
                            <span>Sélectionner une ville... </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-100 p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={placeholder}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center space-y-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                                        <p className="text-sm text-muted-foreground">
                                            {"echerche en cours..."}
                                        </p>
                                    </div>
                                </div>
                            ) : cities.length === 0 ? (
                                <CommandEmpty>
                                    {searchQuery. length < 2 ? (
                                        <div className="py-6 text-center text-sm">
                                            <p className="text-muted-foreground mb-2">
                                                {"recherchez n'importe quelle ville du monde"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Tapez au moins 2 caractères...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center text-sm">
                                            <p className="text-muted-foreground">
                                                Aucune ville trouvée pour &quot;{searchQuery}&quot;
                                            </p>
                                        </div>
                                    )}
                                </CommandEmpty>
                            ) : (
                                <CommandGroup heading="Résultats">
                                    {cities.map((city, index) => {
                                        const location:  Location = {
                                            city:  city.name,
                                            country: city.country,
                                            flag: getFlagEmoji(city. countryCode),
                                        };

                                        return (
                                            <CommandItem
                                                key={`${city.name}-${city. countryCode}-${index}`}
                                                value={`${city.name} ${city. country}`}
                                                onSelect={() => {
                                                    onChange(location);
                                                    setOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                className="flex items-center gap-3 py-3"
                                            >
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        value?. city === city.name &&
                                                        value?.country === city.country
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                <span className="text-xl">{location.flag}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{city.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                            {city.country}
                          </span>
                                                </div>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}