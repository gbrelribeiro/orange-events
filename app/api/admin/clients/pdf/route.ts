/* app/api/admin/clients/download/route.ts */

import { generateAllClientsPDF } from "@/lib/admin/service";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken<{ id: string, role: string }>(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN"))
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    const pdfBuffer = await generateAllClientsPDF();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=lista-geral-clientes.pdf`,
      },
    });
  } catch (error) {
    console.error("[DOWNLOAD_CLIENTS_ERROR]", error);
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  };
};