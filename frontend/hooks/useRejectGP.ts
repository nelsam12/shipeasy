"use client";

import { useState } from "react";
import { rejectGP } from "@/services/gp.service";
import { toast } from "sonner";

interface UseRejectGPReturn {
  isLoading: boolean;
  error: string | null;
  reject: (gpId: number) => Promise<boolean>;
}

export function useRejectGP(): UseRejectGPReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = async (gpId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await rejectGP(gpId);
      
      if (response.success) {
        toast.success("GP rejeté avec succès");
        return true;
      } else {
        const errorMsg = response.message || "Erreur lors du rejet";
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur lors du rejet";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, reject };
}
