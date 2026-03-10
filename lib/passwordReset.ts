/* lib/passwordReset.ts */

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not configured.");

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

type ResetTokenPayload = {
  userId: string;
  email: string;
  type: "password-reset";
};

export async function generatePasswordResetToken(userId: string, email: string): Promise<string> {
  const payload: ResetTokenPayload = {
    userId,
    email,
    type: "password-reset",
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
};

export async function verifyPasswordResetToken(token: string): Promise<ResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      payload.type !== "password-reset"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      type: payload.type,
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
};