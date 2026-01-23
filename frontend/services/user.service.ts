import type { ApiResponse } from "@/types";
import { User } from "@/types/user.types";
import { Role } from "@/types/role.types";
import { http } from "@/services/http.service";

export interface GetUsersQuery {
  role?: Role;
  search?: string;
}

/**
 * Get users by role (GESTIONNAIRE/ADMIN only)
 * TODO: Implémenter l'endpoint backend GET /users
 */
export function getUsers(query?: GetUsersQuery): Promise<ApiResponse<User[]>> {
  const params = new URLSearchParams();

  if (query?.role) {
    params.append("role", query.role);
  }
  if (query?.search) {
    params.append("search", query.search);
  }

  const queryString = params.toString();
  const url = queryString ? `/users?${queryString}` : "/users";

  return http<ApiResponse<User[]>, undefined>(url, {
    method: "GET",
  });
}
