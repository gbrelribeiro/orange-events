/* app/master/(main)/layout.tsx */

import { ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import "../master.css";

export default function ClientMainLayout({ children }: { children: ReactNode }) {
    const sidebarItems = [
        { name: "Painel Geral", href: "/master" },
        { name: "Meus Eventos", href: "/master/my-events" },
        { name: "Histórico de Eventos", href: "/master/events-history" },
        { name: "Minhas Vendas", href: "/master/my-sales" },
    ];

    return (
        <div className="background">
            <Sidebar role="organizador" items={sidebarItems}/>

            <div className="dashboard-content">
                {children}
            </div>
        </div>
  );
};