export default function GestionnaireGPsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Liste des GPs</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et consultez la liste de tous les Gestionnaires de Proximité (GPs) du système.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">GPs Actifs</h2>
        <p className="text-muted-foreground">
          Cette section affichera la liste complète des GPs avec leurs informations et statuts.
        </p>
      </div>
    </div>
  );
}
