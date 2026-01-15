// app/dashboard/client/page.tsx

import { RoleGuard } from "@/components/guards/RoleGuard";
import { Role } from "@/types";

export default function ClientDashboardPage() {
  return (
    <RoleGuard role={Role.CLIENT}>
      <div>
        <h1>Bienvenue dans votre espace Client</h1>
        {/* Contenu spécifique au GP */}
      </div>
    </RoleGuard>
  );
}
