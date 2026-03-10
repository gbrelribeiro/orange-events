/* app/api/auth/master/register/confirm-email/route.ts */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token é obrigatório" },
        { status: 400 }
      );
    };

    const verification = await prisma.emailVerificationToken.findUnique({
      where: { token },
      select: {
        id: true,
        used: true,
        expiresAt: true,
        masterId: true,
      }
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      );
    };

    if (verification.used) {
      return NextResponse.json(
        { error: "Este e-mail já foi verificado anteriormente" },
        { status: 400 }
      );
    };

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token expirado. Por favor, solicite um novo" },
        { status: 400 }
      );
    };

    if (!verification.masterId) {
      return NextResponse.json(
        { error: "Este token não pertence a uma conta Master" },
        { status: 400 }
      );
    };

    await prisma.$transaction(async (tx) => {
      await tx.master.update({
        where: { id: verification.masterId! }, 
        data: { emailVerified: true }
      });

      await tx.emailVerificationToken.update({
        where: { id: verification.id },
        data: { used: true }
      });
    });

    return NextResponse.json(
      { success: true, message: "E-mail do Master confirmado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CONFIRM_MASTER_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao confirmar e-mail do Master" },
      { status: 500 }
    );
  };
};