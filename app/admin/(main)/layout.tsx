/* app/admin/(main)/layout.tsx */

import { ReactNode } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import "../admin.css";

type SidebarRole = "super_admin" | "admin" | "organizador";

async function getRole(): Promise<SidebarRole> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return "admin";

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const roleFromPayload = (payload.role as string).toLowerCase();

    if (roleFromPayload === "super_admin") return "super_admin";
    if (roleFromPayload === "admin") return "admin";
    if (roleFromPayload === "master") return "organizador";

    return "admin";
  } catch (error) {
    console.error("Erro ao verificar JWT no Layout:", error);
    return "admin";
  };
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const userRole = await getRole();

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
      <Sidebar items={sidebarItems} role={userRole} />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};