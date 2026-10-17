import * as yup from "yup";
import { personas, services } from "../../../data/siteContent";

const requiredString = (label: string) => yup.string().trim().required(`${label} is required`);

export const contactSchema = yup.object({
  name: requiredString("Full name"),
  organisation: yup.string().trim().default(""),
  email: requiredString("Email").email("Enter a valid email address"),
  phone: yup
    .string()
    .trim()
    .default("")
    .matches(/^$|^[+]?[\d\s-]{8,15}$/, "Enter a valid phone number"),
  sector: requiredString("Sector").oneOf(
    [...personas.filter((item) => item.id !== "explorer").map((item) => item.id), "other"],
    "Select a valid sector",
  ),
  service: requiredString("Service of interest").oneOf([...services.map((item) => item.id), "other"], "Select a valid service"),
  message: requiredString("Message").min(20, "Please share a little more detail (at least 20 characters)"),
  consent: yup.boolean().default(false).oneOf([true], "Please accept to continue"),
});

export type ContactFormValues = yup.InferType<typeof contactSchema>;
