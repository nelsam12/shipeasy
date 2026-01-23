"use client";

import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Users, Package, TrendingUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function GestionnaireClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { clients, isLoading, error, refetch } = useClients();

  // Filter clients based on search
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchQuery === "" ||
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  // Calculate statistics
  // TODO: These will be more accurate when we have actual data from backend
  const totalClients = clients.length;
  const activeClients = Math.floor(clients.length * 0.7); // Placeholder: 70% active
  const totalPackages = clients.length * 3; // Placeholder: average 3 packages per client

  function handleSearch() {
    refetch({ search: searchQuery });
  }

  function handleReset() {
    setSearchQuery("");
    refetch();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Liste des Clients</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et gérez la liste de tous les clients utilisant la plateforme Shipeasy.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Avec au moins un colis envoyé
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colis Envoyés</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              Total colis sur la plateforme
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
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />

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
          <p className="text-sm text-muted-foreground">Chargement des clients...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Note: L&apos;endpoint backend GET /users avec filtre role=CLIENT n&apos;est peut-être pas encore implémenté.
              </p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients List */}
      {!isLoading && !error && (
        <>
          {/* Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredClients.length} client{filteredClients.length > 1 ? "s" : ""} trouvé{filteredClients.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Results */}
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Aucun client trouvé</p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "Essayez de modifier vos critères de recherche"
                      : "Aucun client n'est encore enregistré"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{client.fullName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        <span className="text-muted-foreground">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div>
                          <span className="font-medium">Téléphone:</span>{" "}
                          <span className="text-muted-foreground">{client.phone}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Rôle:</span>{" "}
                        <span className="text-muted-foreground">{client.role}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Additional Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Informations supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <strong>Note technique:</strong> Cette page nécessite l&apos;implémentation
            de l&apos;endpoint backend <code>GET /users?role=CLIENT</code> pour récupérer
            la liste complète des clients. Les statistiques sur les clients actifs et les
            colis envoyés nécessitent également des endpoints supplémentaires ou des
            données étendues dans la réponse utilisateur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
