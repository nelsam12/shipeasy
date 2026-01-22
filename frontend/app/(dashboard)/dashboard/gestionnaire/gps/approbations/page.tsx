export default function GestionnaireApprobationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approbations GP</h1>
        <p className="text-muted-foreground mt-2">
          Validez les demandes d&apos;inscription et de modifications des Gestionnaires de Proximité.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Demandes en Attente</h2>
        <p className="text-muted-foreground">
          Cette section affichera les demandes d&apos;approbation en attente pour les GPs.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Historique des Approbations</h2>
        <p className="text-muted-foreground">
          Consultez l&apos;historique des validations effectuées.
        </p>
      </div>
    </div>
  );
}
