/* components/dropdownpassword/DropdownPassword.tsx */

"use client";

import Dropdown from "./Dropdown";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import "./DropdownPassword.css";

type DropdownPasswordProps = {
  password: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLInputElement | null>;
};

export default function DropdownPassword({
  password,
  isOpen,
  onClose,
  triggerRef,
}: DropdownPasswordProps) {
  // Regras de validação em tempo real
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} triggerRef={triggerRef}>
      <div className="dropdown-password-content">
        <p className="dropdown-password-text">Sua senha deve possuir:</p>

        <ul className="dropdown-password-list">
          {/* Mínimo de caracteres */}
          <li className={`flex items-center gap-2 transition-colors duration-300 ${
              checks.minLength ? "confirmation-text" : "input-error-text"
            }`}
          >
            {checks.minLength ? <IoMdCheckmark size={16} /> : <IoMdClose size={16} />}
            <span>Mínimo de 8 caracteres.</span>
          </li>

          {/* Letra Maiúscula */}
          <li className={`flex items-center gap-2 transition-colors duration-300 ${
              checks.hasUppercase ? "confirmation-text" : "input-error-text"
            }`}
          >
            {checks.hasUppercase ? <IoMdCheckmark size={16} /> : <IoMdClose size={16} />}
            <span>Pelo menos 1 letra maiúscula.</span>
          </li>

          {/* Número */}
          <li className={`flex items-center gap-2 transition-colors duration-300 ${
              checks.hasNumber ? "confirmation-text" : "input-error-text"
            }`}
          >
            {checks.hasNumber ? <IoMdCheckmark size={16} /> : <IoMdClose size={16} />}
            <span>Pelo menos 1 número.</span>
          </li>
        </ul>
      </div>
    </Dropdown>
  );
}