// app/dashboard/gp/page.tsx

import { RoleGuard } from "@/components/guards/RoleGuard";
import { Role } from "@/types";

export default function GpDashboardPage() {
  return (
    <RoleGuard role={Role.GP}>
      <div>
        <h1>Bienvenue dans votre espace GP</h1>
        {/* Contenu spécifique au GP */}
      </div>
    </RoleGuard>
  );
}
