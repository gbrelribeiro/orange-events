/* lib/validations/auth/address.ts */

import { z } from "zod";

export function isValidUF(uf: string): boolean {
  const validUFs = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return validUFs.includes(uf.toUpperCase());
};

export function isValidZipCode(cep: string): boolean {
  const zipCodeClean = cep.replace(/\D/g, "")

  return zipCodeClean.length === 8;
};

export const addressSchema = z.object({
  zipCode: z
    .string()
    .refine((val) => isValidZipCode(val), {
      message: "O CEP deve conter exatamente 8 dígitos.",
    })
    .transform((val) => val.replace(/\D/g, "")),

  street: z.string().min(1, "Rua é obrigatória"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, {
      message: "Número do endereço deve ser um valor positivo",
    }),
    
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),

  state: z
    .string()
    .length(2, "Use a sigla do estado (ex: BA)")
    .refine((val) => isValidUF(val), {
      message: "Estado (UF) inválido.",
    })
    .transform((val) => val.toUpperCase()),

  complement: z.string().optional().nullable(),
});