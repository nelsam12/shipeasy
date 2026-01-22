"use client";

import { useState } from "react";
import { useVoyages } from "@/hooks/useVoyages";
import { VoyageCard } from "@/components/voyage/VoyageCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Search, Plane } from "lucide-react";
import { StatutVoyage } from "@/types";

export default function GPVoyagesListPage() {
    const { voyages, isLoading, error, refetch } = useVoyages();
    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState<string>("all");

    function handleSearch() {
        refetch({
            statut: statutFilter === "all" ? undefined : (statutFilter as StatutVoyage),
        });
    }

    function handleReset() {
        setSearch("");
        setStatutFilter("all");
        refetch();
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Chargement des voyages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => refetch()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reessayer
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Tous les voyages</h1>
                <p className="text-muted-foreground mt-1">
                    Liste de tous les voyages disponibles
                </p>
            </div>

            {/* Filtres */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher par ville..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        {/* Filtre statut */}
                        <Select value={statutFilter} onValueChange={setStatutFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value={StatutVoyage.BROUILLON}>Brouillon</SelectItem>
                                <SelectItem value={StatutVoyage.PUBLIE}>Publie</SelectItem>
                                <SelectItem value={StatutVoyage.AFFECTE}>Affecte</SelectItem>
                                <SelectItem value={StatutVoyage.ANNULE}>Annule</SelectItem>
                                <SelectItem value={StatutVoyage.TERMINE}>Termine</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Boutons actions */}
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="flex-1 md:flex-none">
                                <Search className="mr-2 h-4 w-4" />
                                Rechercher
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1 md:flex-none"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reinitialiser
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des voyages */}
            {voyages.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">Aucun voyage trouve</p>
                            <p className="text-sm text-muted-foreground">
                                {search || statutFilter !== "all"
                                    ? "Essayez de modifier vos criteres de recherche"
                                    : "Aucun voyage n'est encore enregistre dans le systeme"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Resume */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {voyages.length} voyage{voyages.length > 1 ? "s" : ""} trouve
                            {voyages.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Grille de cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {voyages.map((voyage) => (
                            <VoyageCard key={voyage.id} voyage={voyage} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}