/* lib/validations/auth/identity.ts */

import { z } from "zod";

export function isValidIdentity(identity: string): boolean {
  const cleaned = identity.replace(/[^0-9X]/gi, "").toUpperCase();

  if (cleaned.length < 7 || cleaned.length > 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  return true;
}

export const identitySchema = z
  .string()
  .min(1, "O RG é obrigatório.")
  .transform((val) => val.replace(/[^0-9X]/gi, "").toUpperCase())
  .refine(isValidIdentity, {
    message: "RG inválido.",
  });

export type IdentityInput = z.infer<typeof identitySchema>;