"use client";

import { useState } from "react";
import { approveGP } from "@/services/gp.service";
import { toast } from "sonner";

interface UseApproveGPReturn {
  isLoading: boolean;
  error: string | null;
  approve: (gpId: number) => Promise<boolean>;
}

export function useApproveGP(): UseApproveGPReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = async (gpId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await approveGP(gpId);
      
      if (response.success) {
        toast.success("GP approuvé avec succès");
        return true;
      } else {
        const errorMsg = response.message || "Erreur lors de l'approbation";
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'approbation";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, approve };
}
