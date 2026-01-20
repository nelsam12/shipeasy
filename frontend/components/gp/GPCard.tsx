"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Eye, Building, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import {GP} from "@/types/gp.type";

interface GPCardProps {
    gp: GP;
}

const statusConfig = {
    ACTIVE: { label: "Actif", variant: "default" as const },
    INACTIVE: { label: "Inactif", variant: "secondary" as const },
    PENDING: { label: "En attente", variant: "outline" as const },
};

export function GPCard({ gp }:  GPCardProps) {
    const router = useRouter();
    const status = statusConfig[gp.status];

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">{gp.fullName}</h3>
                        <p className="text-sm text-muted-foreground">GP #{gp.id}</p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{gp.email}</span>
                </div>

                {/* Téléphone */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{gp.phone}</span>
                </div>

                {/* Entreprise */}
                {gp.companyName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 shrink-0" />
                        <span className="truncate">{gp. companyName}</span>
                    </div>
                )}

                {/* Adresse */}
                {gp.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{gp.address}</span>
                    </div>
                )}

                {/* Date d'inscription */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
            Inscrit le {new Date(gp.createdAt).toLocaleDateString("fr-FR")}
          </span>
                </div>

                {/* Stats voyages */}
                {(gp.totalTrips !== undefined || gp.activeTrips !== undefined) && (
                    <div className="pt-3 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {gp.totalTrips !== undefined && (
                                <div className="text-center p-2 bg-muted/50 rounded">
                                    <div className="font-bold text-lg">{gp.totalTrips}</div>
                                    <div className="text-xs text-muted-foreground">Voyages</div>
                                </div>
                            )}
                            {gp. activeTrips !== undefined && (
                                <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                                    <div className="font-bold text-lg text-green-600">
                                        {gp.activeTrips}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Actifs</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bouton voir détails */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => router.push(`/dashboard/gp/${gp.id}`)}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                </Button>
            </CardContent>
        </Card>
    );
}