import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CreateTripForm } from "@/components/trip/CreateTripForm";
import { ArrowLeft, Plane, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateTripPage() {
    return (
        <div className="h-[calc(100vh-8rem)] overflow-hidden">
            <div className="container max-w-7xl h-full flex flex-col py-4">
                {/* Header compact */}
                <div className="mb-4">
                    <Button variant="ghost" size="sm" asChild className="mb-2">
                        <Link href="/dashboard/gp">
                            <ArrowLeft className="mr-2 h-3 w-3" />
                            Retour
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Plane className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Créer un voyage</h1>
                            <p className="text-xs text-muted-foreground">
                                Publiez votre trajet et gagnez de l'argent
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="grid gap-4 lg:grid-cols-12 flex-1 overflow-hidden">
                    {/* Formulaire - 8 colonnes */}
                    <div className="lg: col-span-8 overflow-y-auto pr-2">
                        <Card className="shadow-sm h-fit">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Informations du voyage</CardTitle>
                                <CardDescription className="text-xs">
                                    Les champs avec <span className="text-red-500">*</span> sont obligatoires
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CreateTripForm />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 4 colonnes */}
                    <div className="lg: col-span-4 space-y-3 overflow-y-auto">
                        {/* Conseils */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    Conseils
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                                <div className="flex gap-2">
                                    <div className="w-1 bg-primary rounded shrink-0" />
                                    <p className="text-muted-foreground">
                                        Indiquez clairement vos dates de départ
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1 bg-primary rounded shrink-0" />
                                    <p className="text-muted-foreground">
                                        Prix compétitif = plus de réservations
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1 bg-primary rounded shrink-0" />
                                    <p className="text-muted-foreground">
                                        Mentionnez les types de colis acceptés
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prix moyens */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    Prix moyens
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-muted-foreground">Afrique → Europe</span>
                                        <span className="font-bold text-primary">5000 FCFA/kg</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-muted-foreground">Afrique → USA</span>
                                        <span className="font-bold text-primary">7000 FCFA/kg</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-muted-foreground">Intra-Afrique</span>
                                        <span className="font-bold text-primary">3000 FCFA/kg</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info rapide */}
                        <Card className="shadow-sm bg-primary/5 border-primary/20">
                            <CardContent className="pt-4 pb-4">
                                <p className="text-xs text-muted-foreground">
                                    💡 <span className="font-medium text-foreground">Astuce :</span> Les descriptions
                                    détaillées reçoivent 3x plus de réservations
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}