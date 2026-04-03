/* lib/getAuthUser.ts */

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "@/types/auth";
import { Role } from "@/types/role";

export async function getAuthUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken<JwtPayload>(token);
  if (!payload) return null;

  switch (payload.role) {
    case Role.CLIENT:
      return await prisma.client.findUnique({ where: { id: payload.id } });
    case Role.MASTER:
      return await prisma.organizer.findUnique({ where: { id: payload.id } });
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
      return await prisma.admin.findUnique({ where: { id: payload.id } });
    default:
      return null;
  };
};