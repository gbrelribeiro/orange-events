/* lib/validations/auth/password.ts */
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(1, "É necessário a senha para fazer login.")