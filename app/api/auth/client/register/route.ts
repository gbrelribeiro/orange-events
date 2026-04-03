/* app/api/auth/client/register/route.ts */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import {
  addressSchema,
  adultBirthDateSchema,
  documentSchema,
  emailSchema,
  firstNameSchema,
  identitySchema,
  lastNameSchema,
  passwordSchema,
  phoneSchema,
} from "@/lib/validations";

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

    const [day, month, year] = birthDate.split("/");
    const isoBirthDate = new Date(`${year}-${month}-${day}T12:00:00Z`);

    /* CREATE A CLIENT WITH ADDRESS */
    await prisma.client.create({
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
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_CLIENT_ERROR]", error);

    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  };
};