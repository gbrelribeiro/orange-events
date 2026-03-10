/* lib/validations/event/create/image.ts */

import { z } from "zod";

export const imageUrlSchema = z
  .string()
  .default("/card_image.png")
  .refine(value => {
    if (value.startsWith("/")) return true;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "URL da imagem inválida.",
  });