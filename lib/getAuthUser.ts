/* lib/getAuthUser.ts */

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

type JwtPayload = {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MASTER" | "CLIENT";
};

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const payload = await verifyToken<JwtPayload>(token);
    
    if (!payload || !payload.id) return null;

    const user = await prisma.client.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    });

    return user;
  } catch (error) {
    console.error("Erro ao recuperar usuário autenticado:", error);
    return null;
  };
};