/* app/api/admin/masters/approve/route.ts */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendMasterApprovalEmail } from "@/lib/email/service";

export async function PATCH(req: Request) {
  try {
    const { masterId, action } = await req.json();

    if (action === 'APPROVE') {
      const updatedMaster = await prisma.master.update({
        where: { id: masterId },
        data: { verifiedAccount: true }
      });

      await sendMasterApprovalEmail(updatedMaster.email, updatedMaster.firstName);

      return NextResponse.json({ message: "Master aprovado com sucesso" });
    };

    if (action === 'REJECT') {
      await prisma.master.delete({ where: { id: masterId } });
      return NextResponse.json({ message: "Solicitação recusada e removida" });
    };

  } catch (error) {
    console.error("[APPROVATION_MASTER_ERROR]", error);
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 });
  };
};