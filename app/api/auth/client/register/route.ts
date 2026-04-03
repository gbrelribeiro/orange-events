/* app/api/auth/client/register/route.ts */

import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";
import { Role } from "@/types/role";
import { 
  emailSchema, 
  passwordSchema, 
  documentSchema, 
  phoneSchema, 
  birthDateSchema,
  addressSchema,
  firstNameSchema,
  lastNameSchema,
  identitySchema
} from "@/lib/validations";

/* ZOD VALIDATION SCHEMAS */
const registerSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  birthDate: birthDateSchema,
  document: documentSchema,
  identity: identitySchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos.",
          issues: parsed.error.issues.map(issue => ({
            field: issue.path[issue.path.length - 1], 
            message: issue.message,
          })),
        }, 
        { status: 400 }
      );
    };

    const { email, password, firstName, lastName, document, identity, phone, birthDate, address } = parsed.data;

    /* VERIFY DUPLICITE */
    const existingClient = await prisma.client.findUnique({ where: { email } });
    if (existingClient) return NextResponse.json({ error: "Email já registrado." }, { status: 409 });

    /* CREATE IN DATABASE */
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        document,
        identity,
        phone,
        birthDate,
        role: Role.CLIENT,
        address: {
          create: address
        }
      },
    });

    const token = await signToken({
      id: client.id,
      email: client.email,
      role: Role.CLIENT,
    });

    const response = NextResponse.json({ success: true }, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } 
  
  catch (error) {
    console.error("[REGISTER_ERROR]:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  };
};