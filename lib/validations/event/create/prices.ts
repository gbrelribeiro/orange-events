/* lib/validations/event/create/prices.ts */

import { z } from "zod";

export const cashPriceSchema = z
  .number()
  .int("O preço deve ser um valor inteiro.")
  .positive("O preço à vista deve ser positivo.");

export const installmentPriceSchema = z
  .number()
  .int("O preço deve ser um valor inteiro.")
  .positive("O preço parcelado deve ser positivo.");