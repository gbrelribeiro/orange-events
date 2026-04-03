/* lib/validations/auth/name.ts */

import { z } from "zod";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "O nome deve conter ao menos 2 letras.")
  .max(40, "O nome está longo demais.")
  .regex(nameRegex, "O nome deve conter apenas letras.");

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "O sobrenome deve conter ao menos 2 letras.")
  .max(40, "O sobrenome está longo demais.")
  .regex(nameRegex, "O sobrenome deve conter apenas letras.");

export const profileSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>