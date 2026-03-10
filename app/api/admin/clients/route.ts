/* app/api/admin/clients/route.ts */

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured.");

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const token = cookieHeader
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const clients = await prisma.client.findMany({
      where: {
        role: "CLIENT"
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        document: true,
        phone: true,
        identity: true,
        birthDate: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("[ADMIN_CLIENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  };
};