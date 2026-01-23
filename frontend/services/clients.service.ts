import type { ApiResponse } from "@/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { http } from "@/services/http.service";

export interface Client {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
}

export interface GetClientsQuery {
  search?: string;
}

/**
 * Get all clients (GESTIONNAIRE/ADMIN only)
 */
export function getClients(query?: GetClientsQuery): Promise<ApiResponse<Client[]>> {
  const params = new URLSearchParams();

  if (query?.search) {
    params.append("search", query.search);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.USERS.CLIENTS}?${queryString}`
    : API_ENDPOINTS.USERS.CLIENTS;

  return http<ApiResponse<Client[]>, undefined>(url, {
    method: "GET",
  });
}
