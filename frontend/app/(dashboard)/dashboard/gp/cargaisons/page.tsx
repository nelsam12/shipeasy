import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function CargaisonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cargaisons</h1>
        <p className="text-muted-foreground mt-1">
          Cette fonctionnalite sera bientot disponible
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            En construction
          </CardTitle>
          <CardDescription>
            La page de gestion des cargaisons est en cours de developpement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Vous pourrez bientot gerer vos cargaisons via cette interface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
