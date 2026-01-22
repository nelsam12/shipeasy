"use client";

import { useMesVoyages } from "@/hooks/useMesVoyages";
import { useVoyagesAffectes } from "@/hooks/useVoyagesAffectes";
import { VoyageCard } from "@/components/voyage/VoyageCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, PackagePlus, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GPDashboardPage() {
    const { voyages: mesVoyages, isLoading: isLoadingMes, error: errorMes } = useMesVoyages();
    const { voyages: voyagesAffectes, isLoading: isLoadingAffectes, error: errorAffectes } = useVoyagesAffectes();
    const router = useRouter();

    const isLoading = isLoadingMes || isLoadingAffectes;
    const error = errorMes || errorAffectes;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
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
                        Gerez vos voyages et suivez vos affectations
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/gp/create-trip">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau voyage
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="mes-voyages" className="space-y-6">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="mes-voyages">
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Mes voyages ({mesVoyages.length})
                    </TabsTrigger>
                    <TabsTrigger value="affectes">
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Affectes ({voyagesAffectes.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mes-voyages" className="space-y-4">
                    {mesVoyages.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <PackagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-medium mb-2">Aucun voyage cree</p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Vous n&apos;avez pas encore cree de voyage
                                    </p>
                                    <Button asChild>
                                        <Link href="/dashboard/gp/create-trip">
                                            Creer mon premier voyage
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {mesVoyages.map((voyage) => (
                                <VoyageCard
                                    key={voyage.id}
                                    voyage={voyage}
                                    onClick={() => router.push(`/voyages/${voyage.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="affectes" className="space-y-4">
                    {voyagesAffectes.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <PackageCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-medium mb-2">Aucun voyage affecte</p>
                                    <p className="text-sm text-muted-foreground">
                                        Aucun voyage ne vous a ete affecte pour le moment
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {voyagesAffectes.map((voyage) => (
                                <VoyageCard
                                    key={voyage.id}
                                    voyage={voyage}
                                    onClick={() => router.push(`/voyages/${voyage.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}