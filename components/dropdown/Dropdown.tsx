/* components/dropdown/Dropdown.tsx */

"use client";

import { useEffect, useRef, ReactNode, RefObject } from "react";
import Link from "next/link";
import "./Dropdown.css";

type DropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  triggerRef: RefObject<HTMLElement | null>; 
  header?: ReactNode;
};

function Dropdown({ isOpen, onClose, children, triggerRef, header }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      if (ref.current && !ref.current.contains(target) && triggerRef.current && !triggerRef.current.contains(target)) {
        onClose();
      };
    };

    if (isOpen) document.addEventListener("click", handleClickOutside);

    return () => { document.removeEventListener("click", handleClickOutside) };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="dropdown-container">
      {header && (
        <>
          <div className="p-2">
            {header}
          </div>
          
          <hr className="division" />
        </>
      )}
      {children}
    </div>
  );
};

type ItemProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

Dropdown.Item = function DropdownItem({ children, href, onClick }: ItemProps) {
  if (href) {
    return (
      <Link href={href} onClick={onClick} className="dropdown-item">
        {children}
      </Link>
    );
  };

  return (
    <button onClick={onClick} className="dropdown-item">
      {children}
    </button>
  );
};

export default Dropdown;