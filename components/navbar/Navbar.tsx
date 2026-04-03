/* components/navbar/Navbar.tsx */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "../dropdown/Dropdown";
import { FaUserCircle, FaUser, FaCalendar } from "react-icons/fa";
import { MdGroup, MdLogout } from "react-icons/md";
import "./Navbar.css";

export default function Navbar({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) window.location.href = "/";
      
    } catch (error) {
      console.error("Erro ao sair:", error);
    };
  };
  
  return (
    <nav className="navbar-styles">
      <div className="max-w-7xl mx-auto between">
        <Link href="/">
          <Image
            src="/logo(1).png"
            alt="Orange School - Logo"
            width={50}
            height={50}
            className="cursor-pointer"
          />
        </Link>

        <div className="relative">
          {isAuthenticated ? (
            <>
              <button
                ref={userButtonRef}
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="user-icon-button"
                aria-label="User menu"
              >
                <FaUserCircle className="icon-size-lg text-3xl" />
              </button>

              <Dropdown
                isOpen={isDropdownOpen}
                onClose={closeDropdown}
                triggerRef={userButtonRef}
              >
                <Dropdown.Item href="/client/profile" onClick={closeDropdown}>
                  <div className="flex items-center gap-2">
                    <FaUser size={18} />
                    <span>Meu Perfil</span>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item href="/client/companions" onClick={closeDropdown}>
                  <div className="flex items-center gap-2">
                    <MdGroup size={18} />
                    <span>Acompanhantes</span>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item href="/client/events" onClick={closeDropdown}>
                  <div className="flex items-center gap-2">
                    <FaCalendar size={18} />
                    <span>Compras</span>
                  </div>
                </Dropdown.Item>

                <hr className="border-neutral-100" />

                <Dropdown.Item onClick={() => { handleLogout(); closeDropdown(); }}>
                  <div className="flex items-center gap-2 text-red-600">
                    <MdLogout size={18} />
                    <span>Sair da Conta</span>
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </>
          ) : (
            <Link href="/client/login" className="button default">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};