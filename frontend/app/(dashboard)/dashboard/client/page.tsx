// app/dashboard/client/page.tsx

import { RequireRole } from "@/app/guards/require-role";
import { Role } from "@/models/role.model";

export default function ClientDashboardPage() {
  return (
    <RequireRole role={Role.CLIENT}>
      <div>
        <h1>Bienvenue dans votre espace Client</h1>
        {/* Contenu spécifique au GP */}
      </div>
    </RequireRole>
  );
}
