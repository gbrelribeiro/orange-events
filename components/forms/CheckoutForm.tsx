/* components/forms/CheckoutForm.tsx */

import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import SavedCompanions from "@/components/savedcompanions/SavedCompanions";
import CompanionForm from "@/components/forms/CompanionForm";
import LinkButton from "@/components/buttons/LinkButton";
import { useSavedCompanions } from "@/hooks/useSavedCompanions";
import { CompanionData, CompanionType } from "@/types/companion";
import { Event, EventTag } from "@/types/event";
import { validateAgeForType } from "@/lib/validations/auth/birthdate";
import "./CheckoutForm.css";

type ApiEvent = Omit<Event, "tag"> & { tag: EventTag };

export default function CheckoutForm () {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;

  const adults = Number(searchParams.get("adults") || 1);
  const childrenOver5 = Number(searchParams.get("childrenOver5") || 0);
  const childrenUnder5 = Number(searchParams.get("childrenUnder5") || 0);
  const paymentMethod = searchParams.get("paymentMethod") || "PIX";
  const installments = Number(searchParams.get("installments") || 1);

  const totalCompanions = adults + childrenOver5 + childrenUnder5;

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const { savedCompanions } = useSavedCompanions();

  const [companionsData, setCompanionData] = useState<CompanionData[]>(
    Array.from({ length: totalCompanions }, () => ({
      name: "",
      birthdate: "",
      document: "",
      identity: "",
      gender: "MALE",
      phone: "",
    }))
  );

  const isSpecialEvent = useMemo(() => {
    return event?.tag === "PRIVATE";
  }, [event]);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/events?all=true");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const found = data.events.find((t: ApiEvent) => t.id === eventId);
        setEvent(found ?? null);
      } catch {
        setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  const isCompanionComplete = (p: CompanionData) =>
    !!(p.name && p.birthdate && p.document && p.identity && p.gender);

  function getCompanionType(index: number): CompanionType | undefined {
    if (isSpecialEvent) return undefined;
    if (index < adults) return "adult";
    if (index < adults + childrenOver5) return "childOver5";
    return "childUnder5";
  }

  function getFilteredSuggestions(currentIndex: number, type?: CompanionType) {
    return savedCompanions.filter((saved) => {
      const isAlreadyUsed = companionsData.some((p, idx) => {
        if (idx === currentIndex) return false;
        return p.document === saved.document || p.identity === saved.identity;
      });
      if (isAlreadyUsed) return false;
      if (!type) return true;
      return validateAgeForType(saved.birthdate, type);
    });
  };

  function handleCompanionChange(index: number, data: CompanionData) {
    const type = getCompanionType(index);

    const isDuplicate = companionsData.some((p, idx) => {
      if (idx === index) return false;
      return (data.document !== "" && p.document === data.document) || 
             (data.identity !== "" && p.identity === data.identity);
    });

    if (isDuplicate) {
      alert("Este acompanhante já foi adicionado.");
      return;
    };

    if (type && data.birthdate.length === 10) {
      if (!validateAgeForType(data.birthdate, type)) {
        const msgs = {
          adult: "Este acompanhante deve ser maior de 18 anos.",
          childOver5: "Este acompanhante deve ter entre 5 e 17 anos.",
          childUnder5: "Este acompanhante deve ter menos de 5 anos."
        };
        alert(msgs[type as keyof typeof msgs]);
        return;
      };
    };

    const updated = [...companionsData];
    updated[index] = data;
    setCompanionData(updated);
  };

  const allComplete = companionsData.every(isCompanionComplete);

  async function handleCheckout() {
    if (!allComplete || loading || isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);

    try {
      const companions = companionsData.map((p, index) => {
        const [day, month, year] = p.birthdate.split("/");
        const type = getCompanionType(index);
        return {
          ...p,
          birthdate: `${year}-${month}-${day}`,
          isMinor: type ? type !== "adult" : false, 
        };
      });

      const res = await fetch(`/api/events/${eventId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companions, paymentMethod, installments }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.checkout_link) {
        window.location.href = data.checkout_link;
      } else if (data.qrcode) {
        const query = new URLSearchParams({
          code: data.qrcode,
          amount: data.amount.toString(),
          purchaseId: data.purchaseId
        });
        
        const destination = `/client/checkout/${eventId}/pix?${query.toString()}`;
        router.push(destination);
      };
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no checkout.");
      setLoading(false);
      isSubmitting.current = false;
    };
  };

  if (loadingEvent) return <div className="center min-h-screen"><p>Carregando...</p></div>;
  
  if (!event) {
    return (
      <div className="column center min-h-screen">
        <LinkButton target="home" />
        <h1 className="semibold-xl mb-5">
          Evento não encontrado.
        </h1>
      </div>
    );
  };

  return (
    <main>
      
      <div className="w-full md:max-w-2xl mx-auto pb-10">
        <LinkButton target="event" eventId={eventId} />
        <div className="section-container column mt-10">
          <div className="center">
            <Image 
              src="/logo(1).png" 
              alt="Logo" 
              width={80} 
              height={30} 
            />
          </div>
          <h1 className="title">Dados dos Acompanhantes</h1>
          <div className="column gap-5">
            {companionsData.map((companion, index) => {
              const type = getCompanionType(index);
              const isExpanded = expandedIndex === index;
              const isComplete = isCompanionComplete(companion);

              return (
                <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <button 
                    onClick={() => setExpandedIndex(isExpanded ? null : index)} 
                    className={`between w-full p-5 ${isExpanded ? "bg-neutral-50" : "bg-white"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="checkout-index">{index + 1}</span>
                      <div className="column-sm text-left">
                        <span>Acompanhantes</span>
                        {type && (
                          <span className="information">
                            {type === "adult" ? "Adulto" : "Criança"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-5">
                      {isComplete && <FaCheck size={16} className="confirm message" />}
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="p-5 column">
                      {getFilteredSuggestions(index, type).length > 0 && (
                        <SavedCompanions
                          savedCompanions={getFilteredSuggestions(index, type)}
                          onSelect={(saved) => {
                            handleCompanionChange(index, saved);
                            if (index + 1 < totalCompanions) setExpandedIndex(index + 1);
                          }}
                          label="Companheiros salvos"
                        />
                      )}
                      <CompanionForm
                        data={companion}
                        type={type} 
                        onChange={(data) => handleCompanionChange(index, data)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button 
            onClick={handleCheckout} 
            disabled={!allComplete || loading} 
            className={`button alternative mt-6 ${!allComplete ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
          >
            {loading ? "Processando..." : "Finalizar e pagar"}
          </button>
        </div>
      </div>
    </main>
  );
};