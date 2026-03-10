/* types/event.ts */

export const eventTagValues = [
  "PUBLIC",
  "PRIVATE",
] as const;

export enum EventStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
};

export enum EventTag {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
};

export type Event = {
  id: string;
  title: string;
  vacancies: number;
  tag: EventTag;
  status: EventStatus;
  cashPrice: number;
  installmentPrice: number;
  initDate: string;
  finalDate: string;
  image: string;
  description: string;
};

export type EventTagValue = typeof eventTagValues[number];