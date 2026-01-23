"use client";

import { useState } from "react";
import { useGPs } from "@/hooks/useGPs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function GestionnaireApprobationsPage() {
  const { gps, isLoading, error, refetch } = useGPs({ isApproved: false });
  const [selectedGP, setSelectedGP] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const selectedGPData = gps.find((gp) => gp.id === selectedGP);

  async function handleApprove() {
    if (!selectedGP) return;

    setIsApproving(true);
    try {
      // TODO: Implémenter l'endpoint backend pour approuver un GP
      // await approveGP(selectedGP);
      
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("GP approuvé avec succès");
      setShowApproveDialog(false);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'approbation du GP");
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject() {
    if (!selectedGP) return;

    setIsRejecting(true);
    try {
      // TODO: Implémenter l'endpoint backend pour rejeter un GP
      // await rejectGP(selectedGP);
      
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("GP rejeté avec succès");
      setShowRejectDialog(false);
      refetch();
    } catch (error) {
      toast.error("Erreur lors du rejet du GP");
    } finally {
      setIsRejecting(false);
    }
  }

  function openApproveDialog(gpId: number) {
    setSelectedGP(gpId);
    setShowApproveDialog(true);
  }

  function openRejectDialog(gpId: number) {
    setSelectedGP(gpId);
    setShowRejectDialog(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Approbations GP</h1>
        <p className="text-muted-foreground mt-2">
          Validez les demandes d&apos;inscription et de modifications des Gestionnaires de Proximité.
        </p>
      </div>

      {/* Alert if no pending approvals */}
      {!isLoading && !error && gps.length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  Aucune demande en attente
                </p>
                <p className="text-sm text-green-700">
                  Toutes les demandes d&apos;approbation ont été traitées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes en Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gps.length}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Requise</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gps.length}</div>
            <p className="text-xs text-muted-foreground">
              GPs en attente de décision
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement des demandes...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => refetch()}>Réessayer</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending GPs List */}
      {!isLoading && !error && gps.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Demandes en Attente de Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gps.map((gp) => (
                  <Card key={gp.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{gp.fullName}</h3>
                            {gp.companyName && (
                              <p className="text-sm text-muted-foreground">
                                {gp.companyName}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              <span className="text-muted-foreground">{gp.email}</span>
                            </div>
                            {gp.phone && (
                              <div>
                                <span className="font-medium">Téléphone:</span>{" "}
                                <span className="text-muted-foreground">{gp.phone}</span>
                              </div>
                            )}
                            {gp.address && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Adresse:</span>{" "}
                                <span className="text-muted-foreground">{gp.address}</span>
                              </div>
                            )}
                          </div>

                          {gp.description && (
                            <div>
                              <p className="font-medium text-sm mb-1">Description des services:</p>
                              <p className="text-sm text-muted-foreground">
                                {gp.description}
                              </p>
                            </div>
                          )}

                          <div className="pt-2">
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              En attente de validation
                            </Badge>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            className="flex-1 md:flex-none"
                            onClick={() => openApproveDialog(gp.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1 md:flex-none"
                            onClick={() => openRejectDialog(gp.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historique placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Approbations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                L&apos;historique des approbations et rejets sera disponible prochainement.
                Cette section affichera les GPs récemment approuvés ou rejetés avec la date
                et le gestionnaire ayant effectué l&apos;action.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver ce GP ?</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir approuver ce GP ? Il pourra commencer à utiliser la plateforme.
            </DialogDescription>
          </DialogHeader>

          {selectedGPData && (
            <div className="p-4 bg-muted rounded-lg space-y-1">
              <p className="font-medium">{selectedGPData.fullName}</p>
              <p className="text-sm text-muted-foreground">{selectedGPData.email}</p>
              {selectedGPData.companyName && (
                <p className="text-sm text-muted-foreground">{selectedGPData.companyName}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isApproving}
            >
              Annuler
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approbation...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approuver
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter ce GP ?</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir rejeter cette demande ? Cette action peut être réversible ultérieurement.
            </DialogDescription>
          </DialogHeader>

          {selectedGPData && (
            <div className="p-4 bg-muted rounded-lg space-y-1">
              <p className="font-medium">{selectedGPData.fullName}</p>
              <p className="text-sm text-muted-foreground">{selectedGPData.email}</p>
              {selectedGPData.companyName && (
                <p className="text-sm text-muted-foreground">{selectedGPData.companyName}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isRejecting}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejet...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
