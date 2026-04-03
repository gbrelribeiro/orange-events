/* types/auth.ts */

import { Role } from "./role";

export type JwtPayload = {
  id: string;
  email: string;
  role: Role;
};