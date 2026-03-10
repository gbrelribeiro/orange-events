/* lib/validations/event/create/tag.ts */

import { z } from "zod";
import { EventTagValue, eventTagValues } from "@/types/event";

export const eventTagSchema = z
  .string()
  .refine((val): val is EventTagValue => eventTagValues.includes(val as EventTagValue), {
    message: "Tipo de viagem inválido.",
  });