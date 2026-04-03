/* components/dropdown/DropdownItem.tsx */

"use client";

import React from "react";
import Link from "next/link";
import "./DropdownItem.css";

type ItemProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export function DropdownItem({ children, href, onClick }: ItemProps) {
  if (href) {
    return (
      <Link href={href} onClick={onClick} className="dropdown-item">
        {children}
      </Link>
    );
  };

  return (
    <button type="button" onClick={onClick} className="dropdown-item">
      {children}
    </button>
  );
};