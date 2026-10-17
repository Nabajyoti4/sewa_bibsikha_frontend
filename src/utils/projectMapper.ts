import type { Project, ServiceCategory } from "../data/siteContent";
import type { ProjectApiItem, ProjectStatusValue, ProjectVisibilityValue } from "../services/apiHelpers";

export const projectStatusLabels: Record<ProjectStatusValue, Project["status"]> = {
  ongoing: "Ongoing",
  completed: "Completed",
};

export const projectVisibilityLabels: Record<ProjectVisibilityValue, string> = {
  active: "Visible",
  inactive: "Hidden",
};

const DEFAULT_PALETTE: [string, string] = ["#0f5132", "#2fa36f"];

export function toProjectCard(project: ProjectApiItem): Project {
  return {
    id: project.id,
    title: project.title,
    location: project.location,
    category: project.category as ServiceCategory,
    status: projectStatusLabels[project.status],
    summary: project.summary,
    metrics: project.metrics.length ? project.metrics : undefined,
    palette: DEFAULT_PALETTE,
    icon: "leaf",
    image: project.imageUrl,
  };
}
