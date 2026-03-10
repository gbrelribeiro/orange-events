/* lib/validations/trip/create/createTrip.ts */

import { z } from "zod";
import { eventTagSchema } from "./tag";
import { imageUrlSchema } from "./image";
import { cashPriceSchema, installmentPriceSchema } from "./prices";

export const createEventSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  description: z.string().min(10, "A descrição deve conter no mínimo 10 caracteres."),
  vacancies: z.number().int().positive("O número de ingressos deve ser positivo."),
  tag: eventTagSchema,
  cashPrice: cashPriceSchema,
  installmentPrice: installmentPriceSchema,
  initDate: z.date({
    message: "Data inicial inválida",
  }),
  finalDate: z.date({
    message: "Data final inválida",
  }),
  image: imageUrlSchema.default("/card_image.png"),
}).refine((data) => data.finalDate >= data.initDate, {
  message: "Data final deve ser igual ou posterior à data inicial",
  path: ["finalDate"],
});