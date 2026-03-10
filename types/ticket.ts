/* types/ticket.ts */

export enum TicketStatus {
  RESERVED = "RESERVED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
};

export interface Ticket {
  id: string;
  tripId: string;
  clientId: string;
  purchaseId: string | null;
  status: TicketStatus;
  baby: boolean;
  createdAt: Date;
  expiresAt: Date;
  passengerId: string | null;
  passengerDocument: string | null;
  passengerName: string | null;
};

export type CreateTicketInput = Omit<Ticket, "id" | "createdAt">;

export type TicketPurchaseItem = {
  id: string;
  baby: boolean;
};

export type TicketWithTrip = Ticket & {
  trip: {
    title: string;
    initDate: Date;
  };
};