/* lib/getAuthUser.ts */

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "@/types/auth";
import { AuthUser } from "@/types/user";

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    
    const payload = await verifyToken<JwtPayload>(token);
    if (!payload || !payload.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) 
      return null;

    return user as AuthUser;
  } 
  
  catch (error) {
    console.error("[GET_AUTH_USER_ERROR]:", error);
    return null;
  };
};