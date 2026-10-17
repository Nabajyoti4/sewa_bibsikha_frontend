const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, "");

const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "user";
const LOGIN_TIMESTAMP_KEY = "loginTimestamp";
const EXPIRES_IN_KEY = "authExpiresIn";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  status: string;
  createdAt: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errorCode: string;
  details: ApiFieldError[];

  constructor(message: string, status = 0, errorCode = "GENERIC_ERROR", details: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

/* ---------- Auth session (localStorage) ---------- */

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getValidAuthToken(): string | null {
  const token = getAuthToken();
  if (!token) return null;

  const loginTimestamp = Number(localStorage.getItem(LOGIN_TIMESTAMP_KEY));
  const expiresIn = Number(localStorage.getItem(EXPIRES_IN_KEY));
  if (loginTimestamp && expiresIn && Date.now() >= loginTimestamp + expiresIn * 1000) {
    return null;
  }
  return token;
}

export function getStoredUserRaw(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUser | null {
  return parseStoredUser(getStoredUserRaw());
}

export function setAuthSession(token: string, user: AuthUser, expiresIn: number) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOGIN_TIMESTAMP_KEY, String(Date.now()));
  localStorage.setItem(EXPIRES_IN_KEY, String(expiresIn));
  window.dispatchEvent(new Event("auth-changed"));
}

export function setCurrentUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
  localStorage.removeItem(EXPIRES_IN_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}

/* ---------- Requests ---------- */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiRequest<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (token && (response.status === 401 || response.status === 403)) {
      clearAuth();
      window.dispatchEvent(new Event("session-expired"));
    }
    throw new ApiError(
      payload?.message ?? "Something went wrong. Please try again.",
      response.status,
      payload?.error_code,
      payload?.details ?? [],
    );
  }

  return payload as T;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof TypeError) {
    return new ApiError("Unable to reach the server. Please check your connection and try again.", 0, "NETWORK_ERROR");
  }
  return new ApiError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
}
