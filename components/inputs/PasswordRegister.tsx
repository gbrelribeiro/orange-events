/* _components/passwordregister/PasswordRegister.tsx */

"use client";

import { useRef, useState } from "react";
import DropdwonPassword from "@/components/dropdown/DropdownPassword";

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
};

export default function PasswordRegister({ value, onChange, error }: PasswordInputProps) {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* PASSWORD RULE (SAME AS ZOD) */
  const isPasswordValid = value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value);

  return (
    <div className="relative">
      <label>
        Senha
      </label>

      <input
        ref={passwordRef}
        type="password"
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onFocus={() => setIsDropdownOpen(true)}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);

          if (isPasswordValid) {
            setIsDropdownOpen(false);
          }
        }}
      />

      {/* ERROR MESSAGE */}
      {error && (
        <span className="error-text">
          {error}
        </span>
      )}

      {/* PASSWORD DROPDOWN */}
      <DropdwonPassword
        password={value}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        triggerRef={passwordRef}
      />
    </div>
  );
};