/* app/api/auth/confirm-email/route.ts */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const verification = await prisma.emailVerificationToken.findUnique({
      where: { token }
    });

    if (
      !verification ||
      verification.used ||
      verification.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      );
    };

    await prisma.$transaction(async (tx) => {
      // 1. Se for um Cliente
      if (verification.clientId) {
        await tx.client.update({
          where: { id: verification.clientId },
          data: { emailVerified: true }
        });
      } 
      // 2. Se for um Master
      else if (verification.masterId) {
        await tx.master.update({
          where: { id: verification.masterId },
          data: { emailVerified: true }
        });
      } else {
        throw new Error("Token não possui um proprietário válido.");
      };

      await tx.emailVerificationToken.update({
        where: { id: verification.id },
        data: { used: true }
      });
    });

    return NextResponse.json({ message: "E-mail confirmado com sucesso" });
  } catch (error) {
    console.error("[CONFIRM_CLIENT_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno ao confirmar e-mail" },
      { status: 500 }
    );
  };
};