"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
  FileText,
} from "lucide-react";

// Placeholder data structure for future implementation
interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdBy: string;
  createdAt: string;
  assignedTo?: string;
}

interface Dispute {
  id: number;
  title: string;
  description: string;
  status: "pending" | "investigating" | "resolved";
  reportedBy: string;
  reportedAgainst: string;
  createdAt: string;
}

// Example placeholder data to show structure
const exampleTickets: SupportTicket[] = [
  {
    id: 1,
    title: "Problème de connexion",
    description: "Je n'arrive pas à me connecter à mon compte",
    status: "open",
    priority: "high",
    createdBy: "Jean Dupont",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: 2,
    title: "Question sur les frais",
    description: "Comment sont calculés les frais de transport ?",
    status: "in_progress",
    priority: "medium",
    createdBy: "Marie Martin",
    createdAt: "2024-01-14T14:20:00",
    assignedTo: "Support Team",
  },
];

const exampleDisputes: Dispute[] = [
  {
    id: 1,
    title: "Colis endommagé",
    description: "Le colis est arrivé endommagé",
    status: "investigating",
    reportedBy: "Client A",
    reportedAgainst: "GP B",
    createdAt: "2024-01-15T09:00:00",
  },
];

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "destructive",
  in_progress: "default",
  resolved: "secondary",
  closed: "outline",
  pending: "destructive",
  investigating: "default",
};

const PRIORITY_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "outline",
  medium: "default",
  high: "secondary",
  urgent: "destructive",
};

export default function GestionnaireSupportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Support & Litiges</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les demandes de support client et résolvez les litiges entre utilisateurs.
        </p>
      </div>

      {/* Alert - Feature Coming Soon */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">
                Fonctionnalité en développement
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Cette page est une prévisualisation de l&apos;interface finale.
                Les endpoints backend pour la gestion des tickets de support et des litiges
                sont en cours d&apos;implémentation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Ouverts</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une réponse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Tickets en traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Litiges Actifs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent une investigation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus (7j)</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Cette dernière semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tickets de Support</CardTitle>
            <Badge variant="secondary">Aperçu</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Voici un exemple de structure pour les tickets de support. Les données réelles
              proviendront de l&apos;endpoint backend une fois implémenté.
            </p>

            {exampleTickets.map((ticket) => (
              <Card key={ticket.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">#{ticket.id} - {ticket.title}</h3>
                        <Badge variant={STATUS_COLORS[ticket.status]}>
                          {ticket.status === "open" && "Ouvert"}
                          {ticket.status === "in_progress" && "En cours"}
                          {ticket.status === "resolved" && "Résolu"}
                          {ticket.status === "closed" && "Fermé"}
                        </Badge>
                        <Badge variant={PRIORITY_COLORS[ticket.priority]}>
                          {ticket.priority === "urgent" && "Urgent"}
                          {ticket.priority === "high" && "Haute"}
                          {ticket.priority === "medium" && "Moyenne"}
                          {ticket.priority === "low" && "Basse"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {ticket.description}
                      </p>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Créé par: {ticket.createdBy}</div>
                        <div>Date: {new Date(ticket.createdAt).toLocaleString("fr-FR")}</div>
                        {ticket.assignedTo && <div>Assigné à: {ticket.assignedTo}</div>}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button size="sm" className="flex-1 md:flex-none">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Répondre
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 md:flex-none">
                        <FileText className="mr-2 h-4 w-4" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disputes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Litiges en Cours</CardTitle>
            <Badge variant="secondary">Aperçu</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Structure pour la gestion des litiges entre utilisateurs.
              Nécessite des endpoints backend dédiés.
            </p>

            {exampleDisputes.map((dispute) => (
              <Card key={dispute.id} className="border-2 border-orange-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold">Litige #{dispute.id} - {dispute.title}</h3>
                        <Badge variant={STATUS_COLORS[dispute.status]}>
                          {dispute.status === "pending" && "En attente"}
                          {dispute.status === "investigating" && "Investigation"}
                          {dispute.status === "resolved" && "Résolu"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {dispute.description}
                      </p>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Signalé par: {dispute.reportedBy}</div>
                        <div>Concernant: {dispute.reportedAgainst}</div>
                        <div>Date: {new Date(dispute.createdAt).toLocaleString("fr-FR")}</div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button size="sm" className="flex-1 md:flex-none">
                        Investiguer
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 md:flex-none">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Endpoints Backend Requis:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><code>GET /support/tickets</code> - Liste des tickets de support</li>
                <li><code>POST /support/tickets</code> - Créer un ticket</li>
                <li><code>PUT /support/tickets/:id</code> - Mettre à jour un ticket</li>
                <li><code>GET /disputes</code> - Liste des litiges</li>
                <li><code>POST /disputes</code> - Créer un litige</li>
                <li><code>PUT /disputes/:id</code> - Mettre à jour un litige</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-1">Structure de Données Suggérée:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Support Ticket: id, title, description, status, priority, createdBy, assignedTo, messages[], createdAt, updatedAt</li>
                <li>Dispute: id, title, description, status, reportedBy, reportedAgainst, relatedOrderId, evidence[], resolution, createdAt, resolvedAt</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
