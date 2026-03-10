/* app/client/(main)/my-events/page.tsx */

import { getAuthUser } from "@/lib/getAuthUser";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoMdDownload } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";
import LinkButton from "@/components/buttons/LinkButton";
import { formatCurrency } from "@/utils/formatCurrency";
import { TabTitle } from "@/components/tabtitle/TabTitle";

type TicketWithRelations = Prisma.TicketGetPayload<{
  include: { 
    event: true; 
    companion: true; 
    purchase: true 
  }
}>;

export default async function MyEventsPage() {
  const user = await getAuthUser();

  if (!user) redirect("/client/login");

  const tickets = await prisma.ticket.findMany({
    where: {
      clientId: user.id,
      status: {
        in: [
          "PAID", 
          "RESERVED"
        ], 
      },
    },
    include: {
      event: true,
      companion: true,
      purchase: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }) as TicketWithRelations[];

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-8">
      <TabTitle tabName="Eventos Comprados"/>
      
      <LinkButton target="home"/>
      
      <header>
        <h1 className="title">
          Minhas Viagens
        </h1>
        
        <p>
          Acompanhe suas reservas e baixe seus vouchers
        </p>
      </header>

      <div className="grid gap-5">
        {tickets.length === 0 ? (
          <div className="without-tickets-section">
            <p>
              Você não possui reservas ativas ainda.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const purchase = ticket.purchase;
            const event = ticket.event;
            const companion = ticket.companion;

            /* VERIFICATION BASED ON TICKET STATUS */
            const isPaid = ticket.status === "PAID";
            
            /* PRICE CONVERTED FROM CENTS */
            const price = (purchase?.totalcents || 0);
            
            /* PRIORITIZE THE PURCHASE DATE */
            const displayDate = new Date(purchase?.createdAt || ticket.createdAt)
              .toLocaleDateString("pt-BR");

            return (
              <div key={ticket.id} className="event-section">
                <div className="space-y-1">
                  
                  {/* EVENT TITLE WITH TICKET ICON */}
                  <div className="flex items-center gap-2 text-primary">
                    <IoTicketOutline size={20} />
                    <span className="semibold-lg">
                      {event.title}
                    </span>
                  </div>
                  
                  {/* COMPANION SECTION */}
                  <p className="information">
                    Companheiro: <span className="font-medium">
                      {ticket.companionName || companion?.name || `${user.firstName} ${user.lastName}`}
                    </span>
                  </p>
                  
                  {/* EMISSION DATE AND PRICE (SMALLER) */}
                  <div className="event-emission">
                    <p className="text-xs text-neutral-400">
                      Emissão: {displayDate}
                    </p>
                    <span className="bold-sm text-tertiary">
                      {formatCurrency(price)}
                    </span>
                  </div>

                  {/* STATUS TAG */}
                  <div className="mt-2">
                    <span className={`event-status-tag ${isPaid ? "paid-status-tag" : "pendent-status-tag"}`}>
                      {isPaid ? "Pagamento Confirmado" : "Aguardando Pagamento"}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTON ON THE RIGHT */}
                <div className="flex items-center ml-5">
                  {isPaid && purchase && (
                    <Link
                      href={`/api/voucher/${purchase.id}/download`}
                      className="button default flex items-center gap-2"
                    >
                      <IoMdDownload size={22} />
                      <span className="hidden md:block">
                        Baixar Voucher
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};