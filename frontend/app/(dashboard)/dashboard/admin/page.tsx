import { RoleGuard } from "@/components/guards/RoleGuard";
import { Role } from "@/types";

// app/(dashboard)/dashboard/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <RoleGuard role={Role.ADMIN}>
      <div>
        <h1>Bienvenue dans votre espace GP</h1>
        {/* Contenu spécifique au GP */}
      </div>
    </RoleGuard>
  );
}
