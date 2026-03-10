/* app/api/auth/logout/route.ts */

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",     /* SAME PATH USED TO LOGIN */
    maxAge: 0,     /* REMOVE THE COOKIE */
  });

  return res;
};