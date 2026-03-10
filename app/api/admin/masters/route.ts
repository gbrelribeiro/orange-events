/* app/api/admin/masters/route.ts */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingMasters = await prisma.master.findMany({
      where: {
        emailVerified: true,    
        verifiedAccount: false
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        organizationName: true,
        email: true,
        createdAt: true
      }
    });
    return NextResponse.json(pendingMasters);
    
  } catch (error) {
    console.error("[CONFIRM_MASTER_EMAIL_ERROR]", error);
    return NextResponse.json({ error: "Erro ao buscar masters" }, { status: 500 });
  };
};