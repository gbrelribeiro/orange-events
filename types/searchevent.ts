/* types/searchevent.ts */

import { EventTag } from "./event";

export type SearchEvent = {
  id: string;
  title: string;
  description: string;
  image: string;
  cashPrice: number;
  tag: EventTag;
};