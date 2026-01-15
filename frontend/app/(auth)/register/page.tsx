"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader,
  UserPlusIcon,
  Building2,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegister } from "@/hooks/useRegister";
import { Role } from "@/types";
import { ROUTES, MESSAGES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useRegister();
  
  const [activeTab, setActiveTab] = useState<Role>(Role.CLIENT);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    phone: "",
    companyName: "",
    address: "",
    description: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!form.fullName || !form.email || !form.password || !form.phone)
      return "Champs obligatoires manquants";
    if (activeTab === Role.GP && (!form.companyName || !form.address))
      return "Les infos d'agence sont obligatoires pour un GP";
    if (!isValidPhoneNumber(form.phone)) 
      return MESSAGES.VALIDATION.PHONE_INVALID;
    if (form.password !== confirmPassword)
      return MESSAGES.VALIDATION.PASSWORD_MISMATCH;
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await registerUser({ ...form, role: activeTab });
      toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de création";
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/80">
      <div className="w-full max-w-3xl">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Role)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-14 mb-8 bg-white/50 border shadow-sm">
            <TabsTrigger value={Role.CLIENT} className="gap-2 transition-all">
              <UserIcon className="h-4 w-4" /> Client
            </TabsTrigger>
            <TabsTrigger value={Role.GP} className="gap-2 transition-all">
              <Building2 className="h-4 w-4" /> GP / Agence
            </TabsTrigger>
            <TabsTrigger
              value={Role.GESTIONNAIRE}
              className="gap-2 transition-all"
            >
              <ShieldCheck className="h-4 w-4" /> Gestionnaire
            </TabsTrigger>
          </TabsList>

          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-center text-slate-900">
                {activeTab === Role.CLIENT && "Créer un compte Client"}
                {activeTab === Role.GP && "Rejoindre en tant que GP"}
                {activeTab === Role.GESTIONNAIRE && "Espace Gestionnaire"}
              </CardTitle>
              <CardDescription className="text-center text-slate-500 text-base">
                {activeTab === Role.CLIENT &&
                  "Expédiez vos colis en toute sérénité."}
                {activeTab === Role.GP &&
                  "Gérez vos cargaisons et votre clientèle."}
                {activeTab === Role.GESTIONNAIRE &&
                  "Accès administration plateforme."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Common Fields */}
                  <Field>
                    <FieldLabel>Nom complet</FieldLabel>
                    <Input
                      name="fullName"
                      placeholder="Jean Dupont"
                      value={form.fullName}
                      onChange={handleChange}
                      className="bg-white/50"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Email professionnel</FieldLabel>
                    <Input
                      type="email"
                      name="email"
                      placeholder="contact@shipeasy.com"
                      value={form.email}
                      onChange={handleChange}
                      className="bg-white/50"
                    />
                  </Field>

                  {/* GP specific fields */}
                  {activeTab === Role.GP && (
                    <>
                      <Field>
                        <FieldLabel>{"Nom de l'agence"}</FieldLabel>
                        <Input
                          name="companyName"
                          placeholder="Transport Express"
                          value={form.companyName}
                          onChange={handleChange}
                          className="bg-white/50"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Adresse du bureau</FieldLabel>
                        <Input
                          name="address"
                          placeholder="Rue 10, Dakar"
                          value={form.address}
                          onChange={handleChange}
                          className="bg-white/50"
                        />
                      </Field>
                    </>
                  )}

                  <Field className="md:col-span-2">
                    <FieldLabel>Téléphone (WhatsApp)</FieldLabel>
                    <PhoneInput
                      international
                      defaultCountry="SN"
                      value={form.phone}
                      onChange={(v) =>
                        setForm((p) => ({ ...p, phone: v || "" }))
                      }
                      className="flex h-11 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1"
                    />
                  </Field>

                  {activeTab === Role.GP && (
                    <Field className="md:col-span-2">
                      <FieldLabel>Description des services</FieldLabel>
                      <Textarea
                        name="description"
                        placeholder="Ex: Trajets réguliers Paris-Dakar, tarifs au kilo..."
                        value={form.description}
                        onChange={handleChange}
                        className="bg-white/50 min-h-25"
                      />
                    </Field>
                  )}

                  {/* Password fields */}
                  <Field>
                    <FieldLabel>Mot de passe</FieldLabel>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="bg-white/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel>Confirmer</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/50 pr-10"
                      />
                    </div>
                  </Field>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs font-semibold text-destructive text-center uppercase tracking-wider">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-bold shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader className="animate-spin mr-2" />
                  ) : (
                    <UserPlusIcon className="mr-2 h-5 w-5" />
                  )}
                  Créer mon compte
                </Button>
              </form>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
