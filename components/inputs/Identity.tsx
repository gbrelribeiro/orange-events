/* _components/identity/Identity.tsx */

"use client";

import { ChangeEvent, useState } from "react";
import { identitySchema } from "@/lib/validations";

type IdentityProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
};

export default function Identity({id, label, value, onChange, onValidChange, onInteraction }: IdentityProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();
    
    let rawValue = e.target.value.replace(/[^0-9X]/gi, "").toUpperCase();

    if (rawValue.length > 11) rawValue = rawValue.slice(0,11);

    let formatted = rawValue;

    if (rawValue.length >= 10) {
      formatted = rawValue.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (rawValue.length === 9) {
      formatted = rawValue.replace(/(\d{2})(\d{3})(\d{3})([0-9X]{1})/, "$1.$2.$3-$4");
    } else if (rawValue.length > 5) {
      formatted = rawValue.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (rawValue.length > 2) {
      formatted = rawValue.replace(/(\d{2})(\d{1,3})/, "$1.$2");
    }

    onChange(formatted);
    validate(formatted);
  };

  const validate = (value: string) => {
    const cleaned = value.replace(/[^0-9X]/gi, "");

    if (cleaned.length === 0) {
      setError(null);
      onValidChange?.(false);
      return;
    };

    const result = identitySchema.safeParse(value);

    if (result.success) {
      setError(null);
      onValidChange?.(true);
    } else {
      setError(result.error.issues[0].message);
      onValidChange?.(false);
    };
  };

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id}>{label}</label>}

      <input 
        type="text" 
        id={id}
        placeholder="00.000.000-00"
        className={`input ${error ? "error-input": ""}`}
        value={value}
        onChange={handleChange}
        maxLength={13}  
      />

      {error && (
        <span className="error-text">
          {error}
        </span>
      )}
    </div>
  );
};