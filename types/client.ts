/* types/client.ts */

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MASTER = "MASTER",
  CLIENT = "CLIENT"
}

export type ClientListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  phone: string;
  role: Role;
  createdAt: string;
};