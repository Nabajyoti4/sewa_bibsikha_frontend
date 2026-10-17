import * as yup from "yup";
import { IMAGE_TYPES } from "../../../projects/form/schema/projectSchema";

const requiredString = (label: string) => yup.string().trim().required(`${label} is required`);

export const MAX_TITLE_LENGTH = 60;
export const MAX_CAPTION_LENGTH = 120;
export const MAX_TAG_LENGTH = 24;
// Mirrors the API limits that keep one save under Vercel's ~4.5 MB request size.
export const MAX_SLIDE_IMAGE_SIZE_MB = 1;
export const MAX_NEW_IMAGES_PER_SAVE = 4;

export const heroSlideSchema = yup.object({
  title: requiredString("Title").max(MAX_TITLE_LENGTH, `Title must be at most ${MAX_TITLE_LENGTH} characters`),
  tag: requiredString("Tag").max(MAX_TAG_LENGTH, `Tag must be at most ${MAX_TAG_LENGTH} characters`),
  caption: requiredString("Caption").max(MAX_CAPTION_LENGTH, `Caption must be at most ${MAX_CAPTION_LENGTH} characters`),
  // Existing images have no `file`; newly picked ones carry the File to upload.
  images: yup
    .array(
      yup.object({
        imageId: yup.string().required(),
        url: yup.string().required(),
        file: yup
          .mixed<File>()
          .nullable()
          .default(null)
          .test("type", "Use JPG, PNG or WEBP", (file) => !file || IMAGE_TYPES.includes(file.type))
          .test("size", `Max ${MAX_SLIDE_IMAGE_SIZE_MB} MB`, (file) => !file || file.size <= MAX_SLIDE_IMAGE_SIZE_MB * 1024 * 1024),
      }),
    )
    .min(1, "Add at least one image")
    .test(
      "new-images",
      `Upload at most ${MAX_NEW_IMAGES_PER_SAVE} new images per save — save, then add more`,
      (images) => (images ?? []).filter((image) => image.file).length <= MAX_NEW_IMAGES_PER_SAVE,
    )
    .default([]),
});

export type HeroSlideFormValues = yup.InferType<typeof heroSlideSchema>;
