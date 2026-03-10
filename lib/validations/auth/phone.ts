/* lib/validations/auth/phone.ts */

import { z } from "zod";

export const phoneSchema = z
  .string()
  .transform(v => v.replace(/\D/g, ""))
  .refine(v => {
    if (v.length === 11) return v[2] === "9";
    if (v.length === 10) return v[2] !== "9";
    return false;
  }, {
    message: "Número de telefone inválido.",
  });