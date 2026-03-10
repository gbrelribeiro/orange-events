/* app/admin/(main)/requests/page.tsx */

"use client";

import { useState, useEffect } from "react";
import { TabTitle } from "@/components/tabtitle/TabTitle";
import { List, Column } from "@/components/list/List";
import { ActionButton } from "@/components/buttons/ActionButton";

type PendingMaster = {
  id: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  email: string;
  createdAt: string;
};

export default function AdminRequests() {
  const [masters, setMasters] = useState<PendingMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/masters");
      const data = await res.json();
      setMasters(data);
    } catch (error) {
      console.error("Erro ao carregar solicitações", error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (masterId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(masterId);
    try {
      const res = await fetch("/api/admin/masters/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterId, action }),
      });

      if (!res.ok) return;
      setMasters((prev) => prev.filter((m) => m.id !== masterId));
      
    } catch (error) {
      console.error("Erro ao processar ação:", error);
    } finally {
      setProcessingId(null);
    };
  };

  const columns: Column<PendingMaster>[] = [
    {
      key: "name",
      header: "Organizador",
      width: "1fr",
      className: "text-center",
      render: (m) => (
        <div className="flex flex-col">
          <span className="font-bold">
            {m.firstName} {m.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "organization",
      header: "Empresa / Organização",
      width: "1fr",
      className: "text-center",
      hideOnMobile: true,
      render: (m) => <span>{m.organizationName}</span>,
    },
    {
      key: "date",
      header: "Data de Cadastro",
      width: "1fr",
      className: "text-center",
      render: (m) => <span>{new Date(m.createdAt).toLocaleDateString("pt-BR")}</span>,
    },
  ];

  return (
    <main className="p-10">
      <TabTitle tabName="Solicitações" />

      <h1 className="title">Solicitações de Cadastro</h1>

      <div className="mt-10 p-5 rounded-lg">
        {loading ? (
          <p className="text-center p-10">
            Carregando solicitações...
          </p>
        ) : (
          <List
            items={masters}
            columns={columns}
            showHeaders
            getKey={(m) => m.id}
            actions={(m) => (
              <ActionButton
                onApprove={() => handleAction(m.id, "APPROVE")}
                onReject={() => handleAction(m.id, "REJECT")}
                isLoading={processingId === m.id}
              />
            )}
            emptyElement="Nenhuma solicitação pendente no momento."
          />
        )}
      </div>
    </main>
  );
};