/* app/client/(main)/event/[id]/page.tsx */

"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/components/buttons/LinkButton";
import Tag from "@/components/tag/Tag";
import { Event, EventTag } from "@/types/event";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { TabTitle } from "@/components/tabtitle/TabTitle";

type EventDetailProps = {
  params: Promise<{ id: string }>;
};

type ApiEvent = Omit<Event, "tag"> & { 
  tag: EventTag;
  maxInstallments?: number;
};

export default function EventDetail({ params }: EventDetailProps) {
  const { id } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  /* FETCH EVENT */
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/events?all=true");

        if (!res.ok) {
          throw new Error("Erro ao buscar eventos");
        }

        const data = await res.json();
        const foundEvent = data.events.find((e: ApiEvent) => e.id === id);

        setEvent(foundEvent ?? null);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      };
    };

    fetchEvent();
  }, [id]);

  /* CHECK AUTH */
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      };
    };

    checkAuth();
  }, []);

  /* LOADING */
  if (loading || isAuthenticated === null) {
    return (
      <div className="center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  };

  /* NOT FOUND */
  if (!event) {
    return (
      <div className="column center min-h-screen">
        <h1 className="semibold-2xl mb-5">
          Evento não encontrado
        </h1>
        <Link href="/" className="underlined">
          Voltar à tela inicial
        </Link>
      </div>
    );
  };

  /* BUY ACTION */
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push(`/client/login?redirect=/client/checkout/${event.id}`);
      return;
    };

    router.push(`/client/checkout/${event.id}`);
  };

  return (
    <div className="column">
      <TabTitle tabName={`${event.title}`}/>

      {/* HOME BUTTON */}
      <LinkButton target="home"/>

      <div className="grids md:mt-15">
        
        {/* EVENT IMAGE */}
        <div className="client-event-image">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* EVENT INFORMATION */}
        <div className="column">
          
          {/* EVENT TITLE */}
          <div className="column between md:gap-5 gap-2">
            <h1 className="semibold-4xl text-primary">
              {event.title}
            </h1>

            <div>
              {event.tag && (
                <Tag tag={event.tag}/>
              )}
            </div>
          </div>

          <div className="grids gap-5 p-5 rounded-lg">
            {/* INIT (DATE AND HOUR) */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary text-white rounded-lg">
                <MdKeyboardDoubleArrowRight size={20} />
              </div>
              <div className="column">
                <span className="information">
                  Início do Evento
                </span>
                <span className="information">
                  {formatDate(new Date(event.initDate))}
                </span>
              </div>
            </div>

            {/* FINAL (DATE AND HOUR) */}
            <div className="flex gap-2 items-center">
              <div className="p-2 bg-primary text-white rounded-lg">
                <MdKeyboardDoubleArrowLeft size={20} />
              </div>
              <div className="column">
                <span className=" information">
                  Encerramento Estimado
                </span>
                <span className="information">
                  {formatDate(new Date(event.finalDate))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex between flex-col md:flex-row md:gap-20 gap-10">
            {/* PRODUCT PRICE */}
            <div className="column gap-2">
              <div className="semibold-2xl text-tertiary">
                {formatCurrency(event.cashPrice)}
              </div>

              {/* INSTALLMENT PRICE */}
              <div className="text-lg text-neutral-500 dark:text-neutral-300">
                (ou em até {event.maxInstallments ?? 10}x com acréscimo)
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <button 
              className="button alternative flex-1" 
              onClick={handleBuyNow}
              disabled={isAuthenticated === null}
            >
              Garantir ingresso
            </button>
            
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="column">
            <h2 className="semibold-xl text-primary">
              Sobre o evento
            </h2>
            
            <p className="event-description">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};