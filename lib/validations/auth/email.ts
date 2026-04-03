/* lib/validations/auth/email.ts */

import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "O e-mail é obrigatório.")
  .refine((val) => /^\S+@\S+\.\S+$/.test(val), { message: "Endereço de e-mail inválido." });