/* lib/validations/auth/birthdate.ts */

import { z } from "zod";

export const birthDateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido (DD/MM/AAAA).")
  .refine((value) => {
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date < new Date()
    );
  }, { message: "Data inválida ou no futuro." });

export const adultBirthDateSchema = birthDateSchema.refine((value) => {
  const [day, month, year] = value.split("/").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}, {
  message: "Este passageiro deve ter pelo menos 18 anos.",
});

export function validateAgeForType(birthDateStr: string, type: "adult" | "childOver5" | "childUnder5") {
  if (birthDateStr.length < 10) return true; 
  
  const [day, month, year] = birthDateStr.split("/").map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (isNaN(birthDate.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (type === "adult") return age >= 18;
  if (type === "childOver5") return age >= 5 && age < 18;
  if (type === "childUnder5") return age < 5;
  return true;
}