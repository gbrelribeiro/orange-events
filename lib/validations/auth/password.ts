/* lib/validations/auth/password.ts */
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "A senha deve possuir ao menos 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula.")
  .regex(/[0-9]/, "A senha deve conter ao menos um número.");