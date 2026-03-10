/* app/api/admin/clients/[id]/route.ts */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    console.log("Buscando cliente no banco com ID:", id);

    const fullClient = await prisma.client.findUnique({
      where: { id },
      include: {
        address: true,
        passengers: true,
      },
    });

    if (!fullClient)
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

    return NextResponse.json(fullClient);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[API_CLIENT_ERROR]:", errorMessage);
    
    return NextResponse.json({ 
      error: "Erro interno no servidor", 
      details: errorMessage 
    }, 
    { status: 500 });
  };
};