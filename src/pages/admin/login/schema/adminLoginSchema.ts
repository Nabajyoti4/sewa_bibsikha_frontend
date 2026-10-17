import * as yup from "yup";

const requiredString = (label: string) => yup.string().trim().required(`${label} is required`);

export const adminLoginSchema = yup.object({
  email: requiredString("Email").email("Enter a valid email address"),
  password: yup.string().required("Password is required"),
});

export type AdminLoginFormValues = yup.InferType<typeof adminLoginSchema>;
