export default function GestionnaireSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support & Litiges</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les demandes de support client et résolvez les litiges entre utilisateurs.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Tickets de Support</h2>
        <p className="text-muted-foreground">
          Cette section affichera les tickets de support ouverts et leur statut.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Litiges en Cours</h2>
        <p className="text-muted-foreground">
          Consultez et gérez les litiges signalés par les utilisateurs de la plateforme.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Historique Résolu</h2>
        <p className="text-muted-foreground">
          Visualisez l&apos;historique des tickets et litiges résolus.
        </p>
      </div>
    </div>
  );
}
