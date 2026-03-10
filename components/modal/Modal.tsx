/* components/modal/Modal.tsx */

"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const sizeClasses: Record<ModalSize, string> = {
  "sm": "max-w-sm", 
  "md": "max-w-md",
  "lg": "max-w-lg",
  "xl": "max-w-xl",
  "2xl": "max-w-2xl",
  "full": "max-w-[90vw]",
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
};

export default function Modal({ isOpen, onClose, title, children, size = "sm" }: ModalProps) {
  
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-position">
      <div className="modal-overlay" onClick={onClose} />

      <div className={`modal-styles ${sizeClasses[size]}`}>
        {title && (
          <h2 className="modal-title">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};