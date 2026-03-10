/* app/api/admin/admins/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { z } from "zod";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const createAdminSchema = z.object({
  firstName: z.string().trim().min(1, "Nome é obrigatório"),
  lastName: z.string().trim().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().trim().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

/* GET CURRENT ADMIN */
async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    return payload as {
      id: string;
      email: string;
      role: "ADMIN" | "SUPER_ADMIN";
    };
  } catch {
    return null;
  };
};

/* LIST ADMINS */
export async function GET() {
  const user = await getCurrentAdmin();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json(
      { error: "Acesso negado" },
      { status: 403 }
    );
  };

  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ admins });
};

/* CREATE ADMIN */
export async function POST(req: NextRequest) {
  const user = await getCurrentAdmin();

  /* ONLY SUPER ADMIN */
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Apenas Super Admin pode criar admins" },
      { status: 403 }
    );
  };

  const body = await req.json();

  /* DEBUG (pode remover depois) */
  console.log("BODY RECEBIDO:", body);

  const parsed = createAdminSchema.safeParse(body);

  if (!parsed.success) {
    console.log("ZOD ERROR");

    return NextResponse.json(
      {
        issues: parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  };

  const { firstName, lastName, email, password } = parsed.data;

  /* VERIFY EMAIL */
  const exists = await prisma.admin.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Email já cadastrado" },
      { status: 400 }
    );
  };

  /* HASH PASSWORD */
  const hashedPassword = await bcrypt.hash(password, 10);

  /* CREATE A NEW ADMIN */
  const admin = await prisma.admin.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    {
      message: "Administrador criado com sucesso",
      admin,
    },
    { status: 201 }
  );
};