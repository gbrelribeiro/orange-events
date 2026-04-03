/* lib/validations/auth/document.ts */

import { z } from "zod";

export function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) firstCheck = 0;
  if (firstCheck !== digits[9]) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }

  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) secondCheck = 0;
  if (secondCheck !== digits[10]) return false;

  return true;
}

export const documentSchema = z
  .string()
  .transform(value => value.replace(/\D/g, ""))
  .refine(value => value.length === 11, {
    message: "O CPF deve posuir ao menos 11 dígitos.",
  })
  .refine(isValidCPF, {
    message: "CPF inválido.",
  });

export type DocumentInput = z.infer<typeof documentSchema>;