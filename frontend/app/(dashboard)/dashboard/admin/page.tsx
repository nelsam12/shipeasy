import { RequireRole } from "@/app/guards/require-role";
import { Role } from "@/models/role.model";

// app/(dashboard)/dashboard/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <RequireRole role={Role.ADMIN}>
      <div>
        <h1>Bienvenue dans votre espace GP</h1>
        {/* Contenu spécifique au GP */}
      </div>
    </RequireRole>
  );
}
