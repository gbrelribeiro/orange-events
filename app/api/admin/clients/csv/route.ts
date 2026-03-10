/* app/api/admin/clients/csv/route.ts */

import { generateAllClientsCSV } from "@/lib/admin/service";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken<{ id: string; role: string }>(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
    
    if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN"))
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const csvString = await generateAllClientsCSV();
    const date = new Date().toISOString().split('T')[0];

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="lista-geral-clientes-${date}.csv"`,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[CSV_CLIENTS_ERROR]", msg);
    return NextResponse.json({ error: "Erro ao gerar lista de clientes" }, { status: 500 });
  };
};