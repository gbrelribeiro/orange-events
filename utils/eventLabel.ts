/* utils/eventLabel.ts */

import { EventTag } from "@/types/event";

export const EventTagLabel: Record<EventTag, string> = {
  [EventTag.PUBLIC]: "Público",
  [EventTag.PRIVATE]: "Privado",
};