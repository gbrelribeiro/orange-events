/* lib/validations/trip/update/updateTrip.ts */

import { z } from "zod";
import { eventTagSchema } from "../create/tag";
import { imageUrlSchema } from "../create/image";
import { cashPriceSchema, installmentPriceSchema } from "../create/prices";

export const updateEventSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres.").optional(),
  description: z.string().min(10, "A descrição deve conter no mínimo 10 caracteres.").optional(),
  vacancies: z.number().int().positive("O número de ingressos deve ser positivo.").optional(),
  tag: eventTagSchema.optional(),
  cashPrice: cashPriceSchema.optional(),
  installmentPrice: installmentPriceSchema.optional(),
  initDate: z.date({
    message: "Data inicial inválida",
  }).optional(),
  finalDate: z.date({
    message: "Data final inválida",
  }).optional(),
  image: imageUrlSchema.optional(),
}).refine((data) => {
  if (data.initDate && data.finalDate) {
    return data.finalDate >= data.initDate;
  }
  return true;
}, {
  message: "Data final deve ser igual ou posterior à data inicial",
  path: ["finalDate"],
});