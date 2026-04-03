/* app/api/auth/me/route.ts */

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt"; 
import { JwtPayload } from "@/types/auth"; 

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null });
    
    const payload = await verifyToken<JwtPayload>(token);
    if (!payload || !payload.id) return NextResponse.json({ user: null });

    let userData = null;
    userData = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
      },
    });
    
    if (!userData) return NextResponse.json({ user: null });

    return NextResponse.json({ user: userData });
  }
  
  catch (error) {
    console.error("[AUTH_ME_ERROR]", error);
    return NextResponse.json({ user: null });
  };
};