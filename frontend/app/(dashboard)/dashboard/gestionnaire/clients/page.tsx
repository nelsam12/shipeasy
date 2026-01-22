export default function GestionnaireClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Liste des Clients</h1>
        <p className="text-muted-foreground mt-2">
          Consultez et gérez la liste de tous les clients utilisant la plateforme Shipeasy.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Clients Actifs</h2>
        <p className="text-muted-foreground">
          Cette section affichera la liste complète des clients avec leurs informations et activités.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
        <p className="text-muted-foreground">
          Visualisez les statistiques globales sur l&apos;utilisation de la plateforme par les clients.
        </p>
      </div>
    </div>
  );
}
