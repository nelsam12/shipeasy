// app/dashboard/gp/page.tsx

import { RequireRole } from "@/app/guards/require-role";
import { Role } from "@/models/role.model";

export default function GpDashboardPage() {
  return (
    <RequireRole role={Role.GP}>
      <div>
        <h1>Bienvenue dans votre espace GP</h1>
        {/* Contenu spécifique au GP */}
      </div>
    </RequireRole>
  );
}
