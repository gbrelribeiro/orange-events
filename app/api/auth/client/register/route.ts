/* app/api/auth/client/register/route.ts */

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  firstNameSchema,
  lastNameSchema,
  documentSchema,
  identitySchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
} from "@/lib/validations";
import { addressSchema } from "@/lib/validations/auth/address";
import { adultBirthDateSchema } from "@/lib/validations/auth/birthdate";
import { sendVerifyEmail } from "@/lib/email/service";

/* REGISTER VALIDATION SCHEMA */
const registerSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  document: documentSchema,
  identity: identitySchema,
  phone: phoneSchema,
  birthDate: adultBirthDateSchema,
  address: addressSchema,
});

/* REGISTER HANDLER */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sanitizedBody = {
      ...body,
      phone: body.phone ? body.phone.replace(/\D/g, "") : "",
      document: body.document ? body.document.replace(/\D/g, "") : "",
      identity: body.identity ? body.identity.replace(/\D/g, "") : "",
    };

    const parsed = registerSchema.safeParse(sanitizedBody);

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

    const {
      birthDate,
      firstName,
      lastName,
      document,
      email,
      identity,
      password,
      phone,
      address,
    } = parsed.data;

    /* CHECK IF EMAIL EXISTS */
    const existingClient = await prisma.client.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 409 }
      );
    }

    /* CHECK IF DOCUMENT EXISTS */
    const existingDocument = await prisma.client.findUnique({
      where: { document },
      select: { id: true },
    });

    if (existingDocument) {
      return NextResponse.json(
        { error: "CPF já cadastrado." },
        { status: 409 }
      );
    }

    /* CHECK IF IDENTITY EXISTS */
    const existingIdentity = await prisma.client.findUnique({
      where: { identity },
      select: { id: true },
    });

    if (existingIdentity) {
      return NextResponse.json(
        { error: "RG já cadastrado." },
        { status: 409 }
      );
    }

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (tx) => {

      const [day, month, year] = birthDate.split("/");
      const isoBirthDate = new Date(`${year}-${month}-${day}T12:00:00Z`);

      /* 1. CREATE A CLIENT WITH ADDRESS */
      const newClient = await tx.client.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: "CLIENT",
          identity,
          document,
          phone,
          birthdate: isoBirthDate,
          address: {
            create: {
              zipCode: address.zipCode.replace(/\D/g, ""),
              street: address.street,
              number: address.number,
              neighborhood: address.neighborhood,
              city: address.city,
              state: address.state.toUpperCase(),
              complement: address.complement || "",
            },
          },
        },
        select: { id: true, email: true, firstName: true },
      });

      /* 2. CREATE A VERIFY TOKEN */
      const expireTime = 24 * 60 * 60 * 1000;
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + expireTime);

      await tx.emailVerificationToken.create({
        data: {
          clientId: newClient.id,
          token,
          expiresAt,
        },
      });

      return { client: newClient, token };
    });

    /* BASE URL */
    const protocol =
      req.headers.get("x-forwarded-proto") ?? "http";
    const host = req.headers.get("host");

    if (!host) {
      throw new Error("Host não encontrado na requisição");
    }

    const baseUrl = `${protocol}://${host}`;

    /* SEND EMAIL */
    try {
      await sendVerifyEmail(
        result.client.email,
        result.token,
        baseUrl
      );
    } catch (emailError) {
      console.error(
        "Erro ao enviar e-mail de verificação:",
        emailError
      );
    };

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_CLIENT_ERROR]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  };
};