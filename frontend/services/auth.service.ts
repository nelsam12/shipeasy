import type { CreateUserDto, LoginModel, User, ApiResponse } from "@/types";
import { http } from "./http.service";
import { API_ENDPOINTS, BodyType } from "@/lib/constants";

// On utilise ApiResponse<string> car ton login backend renvoie un message ou un token
export function login(payload: LoginModel) {
  return http<ApiResponse<User>, LoginModel>(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: payload,
    bodyType: BodyType.JSON,
  });
}

export function register(payload: CreateUserDto) {
  return http<ApiResponse<User>, CreateUserDto>(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: payload,
    bodyType: BodyType.JSON,
  });
}

// Crucial : Retourne ApiResponse<User> pour correspondre au format { success, data }
export async function getMe(): Promise<ApiResponse<User>> {
  return http<ApiResponse<User>, undefined>(API_ENDPOINTS.AUTH.ME, {
    method: "GET",
  });
}

export async function logout(): Promise<void> {
  await http<void, undefined>(API_ENDPOINTS.AUTH.LOGOUT, {
    method: "POST",
  });
}
