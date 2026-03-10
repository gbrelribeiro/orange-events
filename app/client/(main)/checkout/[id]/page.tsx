/* app/client/(main)/checkout/[id]/page.tsx */

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LinkButton from "@/components/buttons/LinkButton";
import Tag from "@/components/tag/Tag";
import PassengerCounter from "@/components/counter/CompanionCounter";
import PaymentSelector, { PaymentMethod } from "@/components/paymentselector/PaymentSelector";
import { formatCurrency } from "@/utils/formatCurrency";
import { Event, EventTag } from "@/types/event";

const CREDIT_CARD_FEES: Record<number, number> = {
  1: 3.46, 
  2: 4.75, 
  3: 5.65, 
  4: 6.52, 
  5: 7.29, 
  6: 8.05,
  7: 8.50, 
  8: 9.35, 
  9: 10.19, 
  10: 11.15, 
  11: 11.95, 
  12: 12.86,
};

type CheckoutProps = {
  params: Promise<{ id: string }>;
};

type ApiEvent = Omit<Event, "tag"> & {
  tag: EventTag;
  maxInstallments: number;
};

export default function CheckoutPage({ params }: CheckoutProps) {
  const router = useRouter();
  const { id } = use(params);

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const [adults, setAdults] = useState(1);
  const [childrenOver5, setChildrenOver5] = useState(0);
  const [childrenUnder5, setChildrenUnder5] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [installments, setInstallments] = useState(1);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/Events?all=true");
        if (!res.ok) throw new Error("Erro ao buscar viagens");
        const data = await res.json();
        const foundEvent = data.Events.find((t: ApiEvent) => t.id === id);
        setEvent(foundEvent ?? null);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) return <div className="center min-h-screen"><p>Carregando...</p></div>;
  if (!event) return <div className="column center min-h-screen"><h1 className="semibold-xl mb-5">Viagem não encontrada.</h1><LinkButton target="home" /></div>;

  const isHiddenEvent = event.tag === "PRIVATE";

  /* CALCULATE TOTALS */
  const totalCompanions = isHiddenEvent ? adults : (adults + childrenOver5 + childrenUnder5);
  const totalCashPrice = event.cashPrice * totalCompanions;
  const totalInstallmentPrice = event.installmentPrice * totalCompanions;

  const calculateFinalPrice = () => {
    if (paymentMethod === "PIX") return totalCashPrice;
    
    const feePercentage = CREDIT_CARD_FEES[installments] || 0;
    return totalInstallmentPrice * (1 + feePercentage / 100);
  };

  const currentTotalPrice = calculateFinalPrice();
  const installmentValue = currentTotalPrice / installments;

  const handleProceedToForm = () => {
    if (totalCompanions === 0) {
      alert("Por favor, selecione ao menos 1 passageiro.");
      return;
    }

    const queryParams = new URLSearchParams({
      adults: adults.toString(),
      childrenOver5: isHiddenEvent ? "0" : childrenOver5.toString(),
      childrenUnder5: isHiddenEvent ? "0" : childrenUnder5.toString(),
      paymentMethod,
      installments: installments.toString(),
      totalPrice: Math.round(currentTotalPrice).toString(), 
    });

    router.push(`/client/checkout/${id}/form?${queryParams}`);
  };

  return (
    <div className="column max-w-7xl mx-auto">
      <title>{`Checkout - ${event.title}`}</title>
      <LinkButton target="event" eventId={event.id} />

      <div className="mt-10">
        <h1 className="bold-3xl text-primary">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="column">
          <div className="client-event-image">
            <Image src={event.image} alt={event.title} fill className="object-cover" />
          </div>

          <div className="between">
            <h3 className="semibold-2xl text-primary">{event.title}</h3>
            {event.tag && <Tag tag={event.tag} />}
          </div>

          <div className="border-on-top space-y-2 p-5">
            <div className="between">
              <span className="information">Preço base:</span>
              <span className="font-semibold text-green-600">{formatCurrency(event.cashPrice)}</span>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="section-container">
            <PassengerCounter
              adults={adults}
              childrenOver5={childrenOver5}
              childrenUnder5={childrenUnder5}
              onAdultsChange={setAdults}
              onChildrenOver5Change={setChildrenOver5}
              onChildrenUnder5Change={setChildrenUnder5}
              totalPrice={currentTotalPrice}
              formatCurrency={formatCurrency}
              isHiddenEvent={isHiddenEvent}
            />
          </div>
        </div>

        <div className="column">
          <div className="section-container">
            <PaymentSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              installments={installments}
              onInstallmentsChange={setInstallments}
              cashPrice={totalCashPrice}
              installmentPrice={totalInstallmentPrice}
              maxInstallments={event.maxInstallments || 1}
            />

            {paymentMethod === "INSTALLMENTS" && (
              <div className="mt-4 p-3 bg-neutral-100 rounded-lg space-y-1">
                <div className="between text-sm">
                  <span>Taxa de Parcelamento ({installments}x):</span>
                  <span className="font-medium">{CREDIT_CARD_FEES[installments]}%</span>
                </div>
                <div className="between text-lg bold">
                  <span>Valor da Parcela:</span>
                  <span className="text-primary">{formatCurrency(installmentValue)}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleProceedToForm}
            disabled={totalCompanions === 0}
            className={`w-full text-lg ${totalCompanions === 0 ? "button disabled" : "button alternative"}`}
          >
            Continuar para acompanhantes
          </button>

          <div className="text-center text-info mt-4">
            ⛊ Pagamento assegurado por ...
          </div>
        </div>
      </div>
    </div>
  );
}