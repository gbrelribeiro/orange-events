/* app/admin/(main)/layout.tsx */

import { ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import "../admin.css";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const sidebarItems = [
    { name: "Painel Geral", href: "/admin" },
    { name: "Eventos Ativos", href: "/admin/active-events" },
    { name: "Histórico de Eventos", href: "/admin/events-history" },
    { name: "Clientes", href: "/admin/clients" },
    { name: "Organizadores", href: "/admin/masters" },
    { name: "Solicitações", href: "/admin/requests" },
  ];

  return (
    <div className="background">  
      <Sidebar items={sidebarItems}/>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};