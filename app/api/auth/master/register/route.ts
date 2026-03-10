/* app/api/auth/master/register/route.ts */

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  firstNameSchema,
  lastNameSchema,
  emailSchema,
  passwordSchema,
} from "@/lib/validations";
import { sendVerifyEmail } from "@/lib/email/service";

/* MASTER REGISTER VALIDATION SCHEMA */
const masterRegisterSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  organizationName: z.string().min(5, "Nome da organização é obrigatório"),
  email: emailSchema,
  password: passwordSchema,
});

/* REGISTER HANDLER */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = masterRegisterSchema.safeParse(body);

    /* VALIDATION ERROR */
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Falha na validação.",
          issues: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    };

    const { firstName, lastName, organizationName, email, password } = parsed.data;

    /* CHECK IF EMAIL EXISTS IN MASTER TABLE */
    const existingMaster = await prisma.master.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingMaster) {
      return NextResponse.json(
        { error: "Email já cadastrado para um Master." },
        { status: 409 }
      );
    };

    /* CHECK IF ORGANIZATION NAME EXISTS */
    const existingOrg = await prisma.master.findUnique({
      where: { organizationName },
      select: { id: true },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Nome de organização já está em uso." },
        { status: 409 }
      );
    };

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (tx) => {
      /* 1. CREATE MASTER */
      const newMaster = await tx.master.create({
        data: {
          firstName,
          lastName,
          organizationName,
          email,
          password: hashedPassword,
          role: "MASTER",
          verifiedAccount: false,
          emailVerified: false,
        },
        select: { id: true, email: true },
      });

      /* 2. CREATE A VERIFY TOKEN */
      const expireTime = 24 * 60 * 60 * 1000;
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + expireTime);

      await tx.emailVerificationToken.create({
        data: {
          masterId: newMaster.id,
          token,
          expiresAt,
        },
      });

      return { master: newMaster, token };
    });

    /* BASE URL FOR EMAIL */
    const protocol = req.headers.get("x-forwarded-proto") ?? "http";
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    /* SEND EMAIL */
    try {
      await sendVerifyEmail(
        result.master.email,
        result.token,
        baseUrl
      );
    } catch (emailError) {
      console.error("[MASTER_EMAIL_ERROR]", emailError);
    };

    return NextResponse.json(
      { success: true, message: "Master registrado com sucesso. Verifique seu email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_MASTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  };
};