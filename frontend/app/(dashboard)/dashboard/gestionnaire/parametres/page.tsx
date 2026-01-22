export default function GestionnaireParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configurez les paramètres de votre compte gestionnaire et les préférences du système.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Profil Gestionnaire</h2>
        <p className="text-muted-foreground">
          Modifiez vos informations personnelles et préférences de compte.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <p className="text-muted-foreground">
          Gérez vos préférences de notification par email et dans l&apos;application.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
        <p className="text-muted-foreground">
          Configurez les options de sécurité et changez votre mot de passe.
        </p>
      </div>
    </div>
  );
}
