import { CreateUserDto } from "@/models/create-user.model";
import { LoginModel } from "@/models/login.model";
import { http } from "./http.service";
import { API, BodyType } from "@/lib/consts";
import { User } from "@/models/user.model";
import { ApiResponse } from "@/models/api-response.model";

// On utilise ApiResponse<string> car ton login backend renvoie un message ou un token
export function login(payload: LoginModel) {
  return http<ApiResponse<User>, LoginModel>(API.AUTH.LOGIN, {
    method: "POST",
    body: payload,
    bodyType: BodyType.JSON,
  });
}

export function register(payload: CreateUserDto) {
  return http<ApiResponse<User>, CreateUserDto>(API.AUTH.REGISTER, {
    method: "POST",
    body: payload,
    bodyType: BodyType.JSON,
  });
}

// Crucial : Retourne ApiResponse<User> pour correspondre au format { success, data }
export async function getMe(): Promise<ApiResponse<User>> {
  return http<ApiResponse<User>, undefined>(API.AUTH.ME, {
    method: "GET",
  });
}

export async function logout(): Promise<void> {
  await http<void, undefined>(API.AUTH.LOGOUT, {
    method: "POST",
  });
}
