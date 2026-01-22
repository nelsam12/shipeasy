"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Eye, Building, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GP } from "@/types/gp.type";

interface GPCardProps {
    gp: GP;
}

export function GPCard({ gp }: GPCardProps) {
    const router = useRouter();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">{gp.fullName}</h3>
                        <p className="text-sm text-muted-foreground">GP #{gp.id}</p>
                    </div>
                    {gp.isApproved ? (
                        <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Approuvé
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            En attente
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{gp.email}</span>
                </div>

                {/* Téléphone */}
                {gp.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{gp.phone}</span>
                    </div>
                )}

                {/* Entreprise */}
                {gp.companyName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 shrink-0" />
                        <span className="truncate">{gp.companyName}</span>
                    </div>
                )}

                {/* Adresse */}
                {gp.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{gp.address}</span>
                    </div>
                )}

                {/* Description */}
                {gp.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
                        {gp.description}
                    </p>
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