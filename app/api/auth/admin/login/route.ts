/* app/api/auth/admin/login/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "Email not found." },
      { status: 400 }
    );
  };

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 400 }
    );
  };

  const token = await signToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
};