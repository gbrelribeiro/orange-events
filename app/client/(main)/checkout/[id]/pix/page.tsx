/* app/client/(main)/checkout/[id]/pix/page.tsx */

"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCodeGenerator from "@/components/qrcode/QRCode";
import LinkButton from "@/components/buttons/LinkButton";
import CopyButton from "@/components/buttons/CopyButton";
import { formatCurrency } from "@/utils/formatCurrency";
import { TabTitle } from "@/components/tabtitle/TabTitle";

function PixContent({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams();
  
  const pixCode = searchParams.get("code") || "";
  const amountValue = Number(searchParams.get("amount") || 0);

  if (!pixCode) {
    return (
      <div className="center min-h-screen">
        <p className="animate-pulse">
          Gerando código de pagamento...
        </p>
      </div>
    );
  }

  return (
    <div className="column max-w-2xl mx-auto py-10 px-5 space-y-8">
      <LinkButton target="event" eventId={eventId} />

      <header className="text-center space-y-2">
        <h1 className="bold-3xl text-primary">
          Quase lá!
        </h1>
        <p className="text-neutral-600">
          Finalize seu pagamento via Pix para garantir sua vaga.
        </p>
      </header>

      <div className="section-container">
        <div className="text-center mb-6">
          <span className="text-sm text-neutral-600">
            Valor a pagar
          </span>
          <h2 className="bold-3xl text-green-700">
            {formatCurrency(amountValue)}
          </h2>
        </div>

        <div className="flex justify-center mb-10">
           <QRCodeGenerator value={pixCode} />
        </div>

        <div className="w-full space-y-4">
          <div className="p-5 border-dashed border-neutral-200 rounded-lg bg-neutral-50">
            <p className="mb-2 text-primary font-semibold text-center">
              Código Pix (Copia e Cola)
            </p>
            <p className="pix-code">
              {pixCode}
            </p>
          </div>

          <div className="center">
            <CopyButton 
              textToCopy={pixCode} 
              label="Copiar Código Pix" 
              iconSize={20}
            />
          </div>
        </div>
      </div>

      <footer className="text-center space-y-4">
        <div className="center gap-2 text-info">
          <div className="pix-status" />
          <p className="text-sm font-medium">
            Aguardando confirmação do pagamento...
          </p>
        </div>
        <p className="information">
          Identificamos seu pagamento automaticamente. Não é necessário enviar comprovante.
        </p>
      </footer>
    </div>
  );
}

export default function PixPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 

  return (
    <>
      <TabTitle tabName="Pagamento PIX"/>
      <Suspense fallback={
        <div className="center min-h-screen column gap-4">
          <div className="pix-status animate-bounce" />
          <p className="text-neutral-500">Carregando dados do pagamento...</p>
        </div>
      }>
        <PixContent eventId={id} />
      </Suspense>
    </>
  );
};