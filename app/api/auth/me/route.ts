/* app/api/auth/me/route.ts */

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured.");

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) return NextResponse.json({ user: null });

  const token = cookieHeader
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ user: null });

  try {
    const { payload } = await jwtVerify(token, secret);

    if ( typeof payload.id !== "string" || 
        typeof payload.email !== "string" || 
        (payload.role !== "CLIENT" && 
          payload.role !== "ADMIN" && 
          payload.role !== "SUPER_ADMIN" &&
          payload.role !== "MASTER") ) {
      return NextResponse.json({ user: null });
    };

    let userData = null;

    if (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN") {
      userData = await prisma.admin.findUnique({
        where: { id: payload.id as string },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
        },
      });
    } 
    
    else if (payload.role === "CLIENT") {
      userData = await prisma.client.findUnique({
        where: { id: payload.id as string},
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
        },
      });
    } 
    
    else if (payload.role === "MASTER") {
      userData = await prisma.master.findUnique({
        where: { id: payload.id as string},
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          organizationName: true,
        },
      });
    };

    if (!userData) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: userData,
    });
  
  } catch {
    return NextResponse.json({ user: null });
  };
};