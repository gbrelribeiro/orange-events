/* lib/jwt.ts */

import { SignJWT, jwtVerify } from "jose";
import { JwtPayload } from "@/types/auth";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  };
};