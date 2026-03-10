/* components/navbar/Navbar.tsx */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "../dropdown/Dropdown";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

export type DropdownItemConfig = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type NavbarProps = {
  dropdownItems?: DropdownItemConfig[];
  isAuthenticated?: boolean;
};

export default function Navbar({ dropdownItems = [], isAuthenticated }: NavbarProps) {
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <nav className="navbar-styles">
      <div className="max-w-7xl mx-auto between">
        <div>
          <Image
            src="/logo(1).png"
            alt="Orange School - Logo"
            width={50}
            height={50}
          />
        </div>

        <div className="relative">
          {isAuthenticated ? (
            <>
              <button
                ref={userButtonRef}
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="user-icon-button"
                aria-label="User menu"
              >
                <FaUserCircle className="icon-size-lg" />
              </button>

              <Dropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                triggerRef={userButtonRef}
              >
                {dropdownItems.map((item, index) => (
                  <Dropdown.Item 
                    key={index} 
                    href={item.href} 
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}

                <Dropdown.Item>
                  Sair da Conta
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