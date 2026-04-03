/* _components/document/Document.tsx */

"use client";

import { ChangeEvent, useState } from "react";
import { documentSchema } from "@/lib/validations/auth/document";

type DocumentProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
};

export default function Document({ id, label, value, onChange, onValidChange, onInteraction }: DocumentProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();
    
    let digits = e.target.value.replace(/\D/g, "");

    if (digits.length > 11) digits = digits.slice(0, 11);

    let formatted = digits;

    if (digits.length > 9)
      formatted = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (digits.length > 6)
      formatted = digits.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (digits.length > 3)
      formatted = digits.replace(/(\d{3})(\d{1,3})/, "$1.$2");

    onChange(formatted);
    validate(formatted);
  };

  const validate = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "");

    if (onlyDigits.length === 0) {
      setError(null);
      onValidChange?.(false);
      return;
    };

    const result = documentSchema.safeParse(value);

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
        placeholder="000.000.000-00"
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onChange={handleChange}
        maxLength={14}
      />

      {error && (
        <span className="error-text">
          {error}
        </span>
      )}
    </div>
  );
};