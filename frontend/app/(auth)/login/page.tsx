"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, LogInIcon } from "lucide-react";
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
import { useLogin } from "@/hooks/useLogin";
import { ROUTES, MESSAGES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.login || !form.password) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    try {
      const userData = await login(form);
      toast.success(MESSAGES.AUTH.LOGIN_SUCCESS);
      
      // Redirect to role-specific dashboard
      const targetPath = `/dashboard/${userData.role.toLowerCase()}`;
      router.push(targetPath);
    } catch {
      toast.error(error || "Erreur de connexion");
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md px-4">
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
