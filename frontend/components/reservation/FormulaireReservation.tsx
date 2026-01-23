"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreerReservation } from "@/hooks/useCreerReservation";
import { toast } from "sonner";
import { MESSAGES, ROUTES } from "@/lib/constants";
import type { CreerReservationDto } from "@/types";
import { Loader2 } from "lucide-react";

interface FormulaireReservationProps {
  voyageId: number;
  capaciteDisponible: number;
  onSuccess?: () => void;
}

export function FormulaireReservation({
  voyageId,
  capaciteDisponible,
  onSuccess,
}: FormulaireReservationProps) {
  const router = useRouter();
  const { creer, isLoading } = useCreerReservation();

  const [poidsKg, setPoidsKg] = useState("");
  const [description, setDescription] = useState("");
  const [adresseEnlevement, setAdresseEnlevement] = useState("");
  const [adresseLivraison, setAdresseLivraison] = useState("");
  const [nomDestinataire, setNomDestinataire] = useState("");
  const [telephoneDestinataire, setTelephoneDestinataire] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!poidsKg || Number(poidsKg) <= 0) {
      newErrors.poidsKg = "Le poids doit être supérieur à 0 kg";
    } else if (Number(poidsKg) > capaciteDisponible) {
      newErrors.poidsKg = `Le poids ne peut pas dépasser la capacité disponible (${capaciteDisponible} kg)`;
    } else if (Number(poidsKg) > 1000) {
      newErrors.poidsKg = "Le poids ne peut pas dépasser 1000 kg";
    }

    if (!nomDestinataire || nomDestinataire.trim().length === 0) {
      newErrors.nomDestinataire = "Le nom du destinataire est obligatoire";
    }

    if (!telephoneDestinataire || telephoneDestinataire.trim().length === 0) {
      newErrors.telephoneDestinataire =
        "Le téléphone du destinataire est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const data: CreerReservationDto = {
        voyageId,
        poidsKg: Number(poidsKg),
        description: description.trim() || undefined,
        adresseEnlevement: adresseEnlevement.trim() || undefined,
        adresseLivraison: adresseLivraison.trim() || undefined,
        nomDestinataire,
        telephoneDestinataire,
      };

      await creer(data);
      toast.success(MESSAGES.RESERVATION.CREATE_SUCCESS);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`${ROUTES.DASHBOARD.CLIENT}/colis/liste`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.RESERVATION.CREATE_ERROR;
      toast.error(errorMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Poids du colis */}
      <div className="space-y-1.5">
        <Label htmlFor="poidsKg" className="text-sm">
          Poids du colis (kg) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="poidsKg"
          type="number"
          min="0.1"
          max={capaciteDisponible}
          step="0.1"
          placeholder="15.5"
          value={poidsKg}
          onChange={(e) => setPoidsKg(e.target.value)}
          className={errors.poidsKg ? "border-red-500" : ""}
        />
        {errors.poidsKg && (
          <p className="text-xs text-red-500">{errors.poidsKg}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Capacité disponible : {capaciteDisponible} kg
        </p>
      </div>

      {/* Description du colis */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm">
          Description du colis <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Ex: Vêtements, livres, électronique..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none text-sm"
        />
      </div>

      {/* Adresses */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="adresseEnlevement" className="text-sm">
            Adresse d'enlèvement <span className="text-muted-foreground">(optionnel)</span>
          </Label>
          <Textarea
            id="adresseEnlevement"
            placeholder="123 Rue de la République, Dakar, Sénégal"
            value={adresseEnlevement}
            onChange={(e) => setAdresseEnlevement(e.target.value)}
            rows={2}
            className="resize-none text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="adresseLivraison" className="text-sm">
            Adresse de livraison <span className="text-muted-foreground">(optionnel)</span>
          </Label>
          <Textarea
            id="adresseLivraison"
            placeholder="456 Avenue des Champs-Élysées, Paris, France"
            value={adresseLivraison}
            onChange={(e) => setAdresseLivraison(e.target.value)}
            rows={2}
            className="resize-none text-sm"
          />
        </div>
      </div>

      {/* Informations du destinataire */}
      <div className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-sm">Informations du destinataire</h3>
        
        <div className="space-y-1.5">
          <Label htmlFor="nomDestinataire" className="text-sm">
            Nom complet <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nomDestinataire"
            type="text"
            placeholder="Jean Dupont"
            value={nomDestinataire}
            onChange={(e) => setNomDestinataire(e.target.value)}
            className={errors.nomDestinataire ? "border-red-500" : ""}
          />
          {errors.nomDestinataire && (
            <p className="text-xs text-red-500">{errors.nomDestinataire}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telephoneDestinataire" className="text-sm">
            Téléphone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="telephoneDestinataire"
            type="tel"
            placeholder="+33612345678"
            value={telephoneDestinataire}
            onChange={(e) => setTelephoneDestinataire(e.target.value)}
            className={errors.telephoneDestinataire ? "border-red-500" : ""}
          />
          {errors.telephoneDestinataire && (
            <p className="text-xs text-red-500">{errors.telephoneDestinataire}</p>
          )}
        </div>
      </div>

      {/* Bouton de soumission */}
      <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Création...
          </>
        ) : (
          "Créer la réservation"
        )}
      </Button>
    </form>
  );
}
