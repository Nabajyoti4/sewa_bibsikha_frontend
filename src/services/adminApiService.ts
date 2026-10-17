import { apiRequest, handleApiError } from "./apiHelpers";
import type { AuthUser } from "./apiHelpers";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResult> {
  try {
    const response = await apiRequest<ApiResponse<LoginResult>>("/auth/login", { method: "POST", body: payload });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getMe(): Promise<AuthUser> {
  try {
    const response = await apiRequest<ApiResponse<AuthUser>>("/auth/me");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
