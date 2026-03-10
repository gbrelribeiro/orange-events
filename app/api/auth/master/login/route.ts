/* app/api/auth/master/login/route.ts */

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { z } from "zod";
import { emailSchema } from "@/lib/validations";

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha requirida."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Falha na validação.",
          issues: parsed.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    };

    const { email, password } = parsed.data;

    const master = await prisma.master.findUnique({
      where: { email },
    });

    if (!master || master.role !== "MASTER") {
      return NextResponse.json(
        { error: "Email não encontrado." },
        { status: 401 }
      );
    };

    if (!master.emailVerified) {
        return NextResponse.json(
            { error: "Confirme seu e-mail antes de entrar" },
            { status: 403 }
        );
    };

    const valid = await bcrypt.compare(password, master.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Senha incorreta." },
        { status: 401 }
      );
    };

    const token = await signToken({
      id: master.id,
      email: master.email,
      role: "MASTER",
    });

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res;

  } catch (error) {
    console.error("[MASTER_LOGIN_ERROR]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  };
};