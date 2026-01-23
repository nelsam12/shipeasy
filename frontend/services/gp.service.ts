import type { ApiResponse } from "@/types";
import { GetGPsQuery, GP } from "@/types/gp.type";
import { API_ENDPOINTS } from "@/lib/constants";
import { http } from "@/services/http.service";

/**
 * Get all GPs (GESTIONNAIRE/ADMIN only)
 */
export function getGPs(query?: GetGPsQuery): Promise<ApiResponse<GP[]>> {
    const params = new URLSearchParams();

    if (query?.search) {
        params.append("search", query.search);
    }
    if (query?.isApproved !== undefined) {
        params.append("isApproved", String(query.isApproved));
    }

    const queryString = params.toString();
    const url = queryString
        ? `${API_ENDPOINTS.USERS.GPS}?${queryString}`
        : API_ENDPOINTS.USERS.GPS;

    return http<ApiResponse<GP[]>, undefined>(url, {
        method: "GET",
    });
}

/**
 * Approve a GP (GESTIONNAIRE/ADMIN only)
 */
export function approveGP(gpId: number): Promise<ApiResponse<GP>> {
  return http<ApiResponse<GP>, undefined>(
    `${API_ENDPOINTS.USERS.GPS}/${gpId}/approve`,
    {
      method: "PATCH",
    }
  );
}

/**
 * Reject a GP (GESTIONNAIRE/ADMIN only)
 */
export function rejectGP(gpId: number): Promise<ApiResponse<GP>> {
  return http<ApiResponse<GP>, undefined>(
    `${API_ENDPOINTS.USERS.GPS}/${gpId}/reject`,
    {
      method: "PATCH",
    }
  );
}
