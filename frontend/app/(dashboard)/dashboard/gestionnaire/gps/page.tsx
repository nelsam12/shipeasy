"use client";

import { useState } from "react";
import { useGPs } from "@/hooks/useGPs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, Users, CheckCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function GestionnaireGPsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const { gps, isLoading, error, refetch } = useGPs();

  // Filter GPs based on search and approval status
  const filteredGPs = gps.filter((gp) => {
    const matchesSearch =
      searchQuery === "" ||
      gp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gp.companyName && gp.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesApproval =
      approvalFilter === "all" ||
      (approvalFilter === "approved" && gp.isApproved) ||
      (approvalFilter === "pending" && !gp.isApproved);

    return matchesSearch && matchesApproval;
  });

  // Calculate statistics
  const totalGPs = gps.length;
  const approvedGPs = gps.filter((gp) => gp.isApproved).length;
  const pendingGPs = gps.filter((gp) => !gp.isApproved).length;

  function handleSearch() {
    refetch({ search: searchQuery, isApproved: approvalFilter === "all" ? undefined : approvalFilter === "approved" });
  }

  function handleReset() {
    setSearchQuery("");
    setApprovalFilter("all");
    refetch();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Liste des GPs</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et consultez la liste de tous les Gestionnaires de Proximité (GPs) du système.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GPs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGPs}</div>
            <p className="text-xs text-muted-foreground">
              Tous les GPs enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPs Approuvés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedGPs}</div>
            <p className="text-xs text-muted-foreground">
              GPs actifs sur la plateforme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGPs}</div>
            <p className="text-xs text-muted-foreground">
              Demandes à valider
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <Input
              placeholder="Rechercher par nom, email ou entreprise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />

            {/* Status filter */}
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement des GPs...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GPs List */}
      {!isLoading && !error && (
        <>
          {/* Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredGPs.length} GP{filteredGPs.length > 1 ? "s" : ""} trouvé{filteredGPs.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Results */}
          {filteredGPs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Aucun GP trouvé</p>
                  <p className="text-sm text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGPs.map((gp) => (
                <Card key={gp.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{gp.fullName}</CardTitle>
                        {gp.companyName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {gp.companyName}
                          </p>
                        )}
                      </div>
                      <Badge variant={gp.isApproved ? "default" : "secondary"}>
                        {gp.isApproved ? "Approuvé" : "En attente"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1 text-sm">
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
                        <div>
                          <span className="font-medium">Adresse:</span>{" "}
                          <span className="text-muted-foreground">{gp.address}</span>
                        </div>
                      )}
                      {gp.description && (
                        <div>
                          <span className="font-medium">Description:</span>{" "}
                          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                            {gp.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
