/* app/api/admin/admins/[id]/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const updateAdminSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal("")),
});

async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      id: string;
      role: "ADMIN" | "SUPER_ADMIN";
    };
  } catch {
    return null;
  };
};

/* PUT — EDIT ADMIN */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const user = await getCurrentAdmin();

  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Apenas Super Admin pode editar administradores" },
      { status: 403 }
    );
  };

  const body = await req.json();
  const parsed = updateAdminSchema.safeParse(body);

  if (!parsed.success) {
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

  const { password, ...rest } = parsed.data;

  const dataToUpdate: Prisma.AdminUpdateInput = {
    ...rest,
  };

  if (password && password.length >= 6) 
    dataToUpdate.password = await bcrypt.hash(password, 10);
  
  await prisma.admin.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json({ success: true });
};

/* DELETE ADMIN */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const user = await getCurrentAdmin();

  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Apenas Super Admin pode deletar administradores" },
      { status: 403 }
    );
  };

  /* PREVENT SELF DELETE */
  if (user.id === id) {
    return NextResponse.json(
      { error: "Você não pode deletar a si mesmo" },
      { status: 400 }
    );
  };

  const adminExists = await prisma.admin.findUnique({
    where: { id },
  });

  if (!adminExists) {
    return NextResponse.json(
      { error: "Administrador não encontrado" },
      { status: 404 }
    );
  };

  await prisma.admin.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Administrador deletado com sucesso",
  });
};