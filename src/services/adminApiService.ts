import { apiRequest, handleApiError, toQueryString } from "./apiHelpers";
import type { ApiResponse, AuthUser, HeroSlideApiItem, PaginatedResponse, ProjectApiItem, ProjectVisibilityValue } from "./apiHelpers";
import type { ContactStatusValue, ContactSubmissionApiItem, ContactSubmissionListResponse } from "./apiHelpers";

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

/* ---------- Projects ---------- */

export interface AdminProjectFilters {
  page: number;
  category?: string;
  visibility?: ProjectVisibilityValue;
}

export async function listAdminProjects({ page, category, visibility }: AdminProjectFilters): Promise<PaginatedResponse<ProjectApiItem>> {
  try {
    return await apiRequest<PaginatedResponse<ProjectApiItem>>(`/admin/projects${toQueryString({ page, category, visibility })}`);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getAdminProject(projectId: string): Promise<ProjectApiItem> {
  try {
    const response = await apiRequest<ApiResponse<ProjectApiItem>>(`/admin/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createProject(formData: FormData): Promise<ProjectApiItem> {
  try {
    const response = await apiRequest<ApiResponse<ProjectApiItem>>("/admin/projects", { method: "POST", body: formData });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProject(projectId: string, formData: FormData): Promise<ProjectApiItem> {
  try {
    const response = await apiRequest<ApiResponse<ProjectApiItem>>(`/admin/projects/${projectId}`, { method: "PUT", body: formData });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    await apiRequest<ApiResponse<null>>(`/admin/projects/${projectId}`, { method: "DELETE" });
  } catch (error) {
    throw handleApiError(error);
  }
}

/* ---------- Hero slides ---------- */

export async function listAdminHeroSlides(): Promise<HeroSlideApiItem[]> {
  try {
    const response = await apiRequest<ApiResponse<HeroSlideApiItem[]>>("/admin/hero-slides");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getAdminHeroSlide(slideId: string): Promise<HeroSlideApiItem> {
  try {
    const response = await apiRequest<ApiResponse<HeroSlideApiItem>>(`/admin/hero-slides/${slideId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createHeroSlide(formData: FormData): Promise<HeroSlideApiItem> {
  try {
    const response = await apiRequest<ApiResponse<HeroSlideApiItem>>("/admin/hero-slides", { method: "POST", body: formData });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateHeroSlide(slideId: string, formData: FormData): Promise<HeroSlideApiItem> {
  try {
    const response = await apiRequest<ApiResponse<HeroSlideApiItem>>(`/admin/hero-slides/${slideId}`, { method: "PUT", body: formData });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteHeroSlide(slideId: string): Promise<void> {
  try {
    await apiRequest<ApiResponse<null>>(`/admin/hero-slides/${slideId}`, { method: "DELETE" });
  } catch (error) {
    throw handleApiError(error);
  }
}

/* ---------- Contact submissions ---------- */

export interface AdminContactFilters {
  page: number;
  status?: ContactStatusValue;
  q?: string;
}

export async function listAdminContacts(filters: AdminContactFilters): Promise<ContactSubmissionListResponse> {
  try {
    return await apiRequest<ContactSubmissionListResponse>(`/admin/contacts${toQueryString({ ...filters })}`);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateContactStatus(submissionId: string, status: ContactStatusValue): Promise<ContactSubmissionApiItem> {
  try {
    const response = await apiRequest<ApiResponse<ContactSubmissionApiItem>>(`/admin/contacts/${submissionId}/status`, {
      method: "PATCH",
      body: { status },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
