"use client";

import {useState} from "react";
import {useGPs} from "@/hooks/useGPs";
import {GPCard} from "@/components/gp/GPCard";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {Loader2, RefreshCw, Search, Users} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {Role} from "@/types";

export default function GPsListPage() {
    const {user} = useAuth();
    const {gps, isLoading, error, refetch} = useGPs();
    const [search, setSearch] = useState("");
    const [approvalFilter, setApprovalFilter] = useState<string>("all");

    function handleSearch() {
        refetch({
            search: search || undefined,
            isApproved: approvalFilter === "all" ? undefined : approvalFilter === "approved",
        });
    }

    function handleReset() {
        setSearch("");
        setApprovalFilter("all");
        refetch();
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-sm text-muted-foreground">Chargement des GPs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => refetch()}>
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    const isGestionnaire = user?.role === Role.GESTIONNAIRE;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    {isGestionnaire ? "Mes GPs placés" : "Liste des GPs"}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {isGestionnaire
                        ? "Gérez les GPs placés que vous supervisez"
                        : "Vue d'ensemble de tous les GPs de la plateforme"}
                </p>
            </div>

            {/* Filtres */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher par nom, email ou entreprise..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        {/* Filtre approbation */}
                        <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Statut"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="approved">Approuvés</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Boutons actions */}
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="flex-1 md:flex-none">
                                <Search className="mr-2 h-4 w-4"/>
                                Rechercher
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1 md:flex-none"
                            >
                                <RefreshCw className="mr-2 h-4 w-4"/>
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des GPs */}
            {gps.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                            <p className="text-lg font-medium mb-2">Aucun GP trouvé</p>
                            <p className="text-sm text-muted-foreground">
                                {search || approvalFilter !== "all"
                                    ? "Essayez de modifier vos critères de recherche"
                                    : "Aucun GP n'est encore enregistré dans le système"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Résumé */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {gps.length} GP{gps.length > 1 ? "s" : ""} trouvé
                            {gps.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Grille de cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {gps.map((gp) => (
                            <GPCard key={gp.id} gp={gp}/>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}