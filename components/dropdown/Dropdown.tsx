/* components/dropdown/Dropdown.tsx */

"use client";

import { ReactNode, RefObject, useRef, useEffect } from "react";
import { DropdownItem } from "./DropdownItem";
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
    /* 
      CLOSES THE DROPDOWN IF THE USER CLICKS ANYWHERE ON THE PAGE  
      THAT IS NOT THE DROPDOWN ITSELF OR THE BUTTON THAT ACTIVATED IT
    */
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      /* IF THE DROPDOWN IS OPEN AND THE CLICK DID NOT OCCUR INSIDE IT */
      const clickedOutsideDropdown = ref.current && !ref.current.contains(target);

      /* IF THE CLICK DID NOT OCCUR ON THE BUTTON THAT OPENS THE DROPDOWN */
      const clickedOutsideTrigger = triggerRef.current && !triggerRef.current.contains(target);

      if (clickedOutsideDropdown && clickedOutsideTrigger) {
        onClose();
      }

      // VERIFY IF THE CLICK WAS OUTSIDE THE DROPDOWN
      if (
        ref.current && 
        !ref.current.contains(target) && 
        triggerRef.current && 
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="dropdown-container">
      {header && (
        <>
          <div className="p-2">{header}</div>
          <hr className="division" />
        </>
      )}
      {children}
    </div>
  );
}

Dropdown.Item = DropdownItem;

export default Dropdown;