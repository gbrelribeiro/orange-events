/* app/api/auth/client/login/route.ts */

import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

/* ZOD VALIDATION SCHEMAS */
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/* POST METHOD FOR LOGIN */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: "Falha na validação.",
          issues: parsed.error.issues.map(issue => ({
            fields: issue.path.join("."),
            message: issue.message,
          })),
        }, 
        { status: 400 }
      );
    };

    const { email, password } = parsed.data;

    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Email não encontrado."},
        { status: 401 }
      );
    };

    const valid = await bcrypt.compare(password, client.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Senha incorreta."},
        { status: 401 }
      );
    };

    const token = await signToken({
      id: client.id,
      email: client.email
    });

    const response = NextResponse.json({ sucess: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  catch (error) {
    console.error("[LOGIN_ERROR]", error);

    return NextResponse.json(
      { error: "Erro interno no servidor."},
      { status: 500 }
    );
  };
};