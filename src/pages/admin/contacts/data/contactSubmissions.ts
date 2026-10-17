import type { ContactStatusValue } from "../../../../services/apiHelpers";

export const contactStatusLabels: Record<ContactStatusValue, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  spam: "Spam",
};
