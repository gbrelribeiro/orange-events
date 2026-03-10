/* lib/validations/auth/email.ts */

import { z } from "zod";

const allowedDomains = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
];

export const emailSchema = z
  .string()
  .email({ message: "Endereço de e-mail inválido." })
  .refine((email) => {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  }, {
    message: "Use um provedor válido (ex: gmail.com, outlook.com).",
  })
  .toLowerCase();