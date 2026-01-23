import { useState, useEffect } from "react";
import { getUsers, GetUsersQuery } from "@/services/user.service";
import { User } from "@/types/user.types";
import { Role } from "@/types/role.types";

export function useClients(initialQuery?: GetUsersQuery) {
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchClients(query?: GetUsersQuery) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUsers({ ...query, role: Role.CLIENT });
      setClients(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des clients");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClients(initialQuery);
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
  };
}
