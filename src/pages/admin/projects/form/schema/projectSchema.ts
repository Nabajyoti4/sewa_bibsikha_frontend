import * as yup from "yup";

const requiredString = (label: string) => yup.string().trim().required(`${label} is required`);

export const projectStatuses = [
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
] as const;

export const projectVisibilities = [
  { value: "active", label: "Visible on site" },
  { value: "inactive", label: "Hidden" },
] as const;

export const MAX_METRICS = 4;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_MB = 5;

export interface ProjectSchemaContext {
  isEdit: boolean;
}

export const projectSchema = yup.object({
  title: requiredString("Title").max(120, "Title must be at most 120 characters"),
  location: requiredString("Location").max(120, "Location must be at most 120 characters"),
  category: requiredString("Category"),
  status: yup
    .string()
    .oneOf(projectStatuses.map((status) => status.value), "Select a valid status")
    .required("Status is required"),
  visibility: yup
    .string()
    .oneOf(projectVisibilities.map((visibility) => visibility.value), "Select a valid visibility")
    .required("Visibility is required"),
  summary: requiredString("Summary")
    .min(20, "Please write at least 20 characters")
    .max(300, "Summary must be at most 300 characters"),
  metrics: yup
    .array(
      yup.object({
        value: requiredString("Value").max(20, "Max 20 characters"),
        label: requiredString("Label").max(40, "Max 40 characters"),
      }),
    )
    .max(MAX_METRICS, `Add at most ${MAX_METRICS} metrics`)
    .default([]),
  // When editing, omitting the image keeps the current one.
  image: yup
    .mixed<File>()
    .nullable()
    .default(null)
    .test("required", "Project image is required", function (file) {
      return (this.options.context as ProjectSchemaContext | undefined)?.isEdit || file instanceof File;
    })
    .test("type", "Upload a JPG, PNG or WEBP image", (file) => !file || IMAGE_TYPES.includes(file.type))
    .test("size", `Image must be ${MAX_IMAGE_SIZE_MB} MB or smaller`, (file) => !file || file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024),
});

export type ProjectFormValues = yup.InferType<typeof projectSchema>;
