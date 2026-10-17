import { apiRequest, handleApiError, toQueryString } from "./apiHelpers";
import type { ApiResponse, ContactSubmissionPayload, ContactSubmissionReceipt, HeroSlideApiItem, PaginatedResponse, ProjectApiItem } from "./apiHelpers";

export interface PublicProjectFilters {
  page: number;
  category?: string;
}

export async function listPublicProjects({ page, category }: PublicProjectFilters): Promise<PaginatedResponse<ProjectApiItem>> {
  try {
    return await apiRequest<PaginatedResponse<ProjectApiItem>>(`/public/projects${toQueryString({ page, category })}`);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getHeroSlides(): Promise<HeroSlideApiItem[]> {
  try {
    const response = await apiRequest<ApiResponse<HeroSlideApiItem[]>>("/public/hero-slides");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createContactSubmission(payload: ContactSubmissionPayload): Promise<ContactSubmissionReceipt> {
  try {
    const response = await apiRequest<ApiResponse<ContactSubmissionReceipt>>("/public/contacts", { method: "POST", body: payload });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
