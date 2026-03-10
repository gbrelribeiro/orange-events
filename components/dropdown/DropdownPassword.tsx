/* components/dropdownpassword/DropdownPassword.tsx */

"use client";

import Dropdown from "./Dropdown";
import "./DropdownPassword.css";

type DropdownPasswordProps = {
  password: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLInputElement | null>;
};

export default function DropdwonPassword({ password, isOpen, onClose, triggerRef }: DropdownPasswordProps) {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} triggerRef={triggerRef}>
      <div className="dropdown-password-content">
        <p className="dropdown-password-text">
          Sua senha deve possuir:
        </p>

        <ul className="dropdown-password-list">
          <li className={checks.minLength ? "confirmation-text" : "input-error-text"}>
            • Mínimo de 8 caracteres.
          </li>
          <li className={checks.hasUppercase ? "confirmation-text" : "input-error-text"}>
            • Pelo menos 1 letra maiúscula.
          </li>
          <li className={checks.hasNumber ? "confirmation-text" : "input-error-text"}>
            • Pelo menos 1 número.
          </li>
        </ul>
      </div>
    </Dropdown>
  );
};