"use client";

import {useState} from "react";
import {useGPs} from "@/hooks/useGPs";
import {GPCard} from "@/components/gp/GPCard";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {Clock, Loader2, RefreshCw, Search, UserCheck, Users, UserX} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {Role} from "@/types";

export default function GPsListPage() {
    const {user} = useAuth();
    const {gps, stats, isLoading, error, refetch} = useGPs();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    function handleSearch() {
        refetch({
            search: search || undefined,
            status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        });
    }

    function handleReset() {
        setSearch("");
        setStatusFilter("all");
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
    const isAdmin = user?.role === Role.ADMIN;

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

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Total */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Users className="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-xs text-muted-foreground">Total GPs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actifs */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <UserCheck className="h-5 w-5 text-green-600"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.active}</p>
                                    <p className="text-xs text-muted-foreground">Actifs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inactifs */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-500/10 rounded-lg">
                                    <UserX className="h-5 w-5 text-gray-600"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.inactive}</p>
                                    <p className="text-xs text-muted-foreground">Inactifs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* En attente */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-500/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-amber-600"/>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.pending}</p>
                                    <p className="text-xs text-muted-foreground">En attente</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filtres */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Recherche */}
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher par nom, email, téléphone ou entreprise..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        {/* Filtre statut */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Statut"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="ACTIVE">Actifs</SelectItem>
                                <SelectItem value="INACTIVE">Inactifs</SelectItem>
                                <SelectItem value="PENDING">En attente</SelectItem>
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
                                {search || statusFilter !== "all"
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