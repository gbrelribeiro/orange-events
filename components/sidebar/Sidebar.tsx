/* components/sidebar/Sidebar.tsx */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import "./Sidebar.css";

type SidebarItems = {
  name: string;
  href: string;
};

type SidebarProps = {
  items: SidebarItems[];
  role?: "super_admin" | "admin" | "organizador";
};

export default function Sidebar({ items, role = "admin" }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSideBar = () => setIsOpen(prev => !prev);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao sair", error);
    } finally {
      setIsOpen(false);
      const redirectPath = role === 'organizador' ? 'master' : 'admin';
      router.replace(`/${redirectPath}/login`);
    };
  };

  function isActive(href: string) {
    if (href === "/admin" || href === "/master")
      return pathname === href;
    
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getRoleClass = () => {
    switch (role) {
      case 'super_admin': return 'gold-tag';
      case 'organizador': return 'purple-tag';
      default: return 'blue-tag';
    };
  };

  return (
    <>
      <button
        onClick={toggleSideBar}
        className="sidebar-toggle-button"
        aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
      >
        {isOpen ? <IoMdClose className="icon-size-md" /> : <IoMdMenu className="icon-size-md" />}
      </button>

      {isOpen && <div onClick={toggleSideBar} className="overlay-mobile" />}

      <aside className={`sidebar-background ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="column h-full">
          
          <div className="sidebar-header">
            <Image
              src="/logo(1).png"
              alt="Logo"
              width={80}
              height={80}
              priority
            />

            {/* CORREÇÃO: Adicionado os parênteses () para chamar a função */}
            <span className={`role-tag ${getRoleClass()}`}>
              {role.replace('_', ' ')}
            </span>
          </div>

          <div className="sidebar-division" />

          <button
            type="button"
            className="sidebar-logout-button"
            onClick={handleLogout}
          >
            <RiLogoutBoxRLine className="icon-size-md" />
            <span>Sair da Conta</span>
          </button>

          <div className="sidebar-division" />
          
          <nav className="flex-1 p-5 overflow-y-auto">
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-item-button ${isActive(item.href) ? "sidebar-item-active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};