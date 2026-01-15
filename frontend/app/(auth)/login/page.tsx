"use client";

import { useAuth } from "@/app/context/auth.context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LoginModel } from "@/models/login.model";
import { login as loginApi } from "@/services/auth.service"; // Renommé pour éviter conflit
import { Eye, EyeOff, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth(); // Récupération de setUser depuis le contexte

  const [form, setForm] = useState<LoginModel>({
    login: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.login || !form.password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Appel au service de login
      const response = await loginApi(form);

      // 2. Extraction de l'utilisateur (Structure: response.data.data.user)
      const userData = response.data;

      if (userData) {
        // 3. MISE À JOUR IMMÉDIATE DU CONTEXTE
        // C'est cette ligne qui permet au dashboard de vous reconnaître sans refresh
        setUser(userData);

        toast.success("Connexion réussie");

        // 4. Redirection vers le dashboard spécifique au rôle
        const targetPath = `/dashboard/${userData.role.toLowerCase()}`;
        router.push(targetPath);
      } else {
        throw new Error("Format de réponse utilisateur invalide");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {" "}
        {/* Changé w-xl par max-w-md pour le responsive */}
        <Card>
          <CardHeader>
            <CardTitle>Se connecter</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour vous connecter
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    name="login"
                    placeholder="test@example.com"
                    value={form.login}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel>Mot de passe</FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((p) => !p)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Field>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <LogInIcon className="mr-2 h-4 w-4" />
                      Se connecter
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
