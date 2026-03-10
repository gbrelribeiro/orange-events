/* components/inputs/Phone.tsx */

"use client";

import { ChangeEvent, useState } from "react";
import "./Inputs.css";

type PhoneProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
};

export default function Phone({ id, label, value, onChange, onValidChange, onInteraction }: PhoneProps) {
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();
    
    let digits = e.target.value.replace(/\D/g, "");

    if (digits.length > 11) digits = digits.slice(0, 11);

    let masked = digits;

    if (digits.length >= 7) {
      if (digits.length === 11) 
        masked = digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      else if (digits.length === 10) 
        masked = digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    
    else if (digits.length > 2) {
      masked = digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } 
    
    else if (digits.length > 0) {
      masked = `(${digits}`;
    };

    onChange(masked);
    validate(digits);
  };

  const validate = (digits: string) => {
    if (digits.length === 0) {
      setError(false);
      onValidChange?.(false);
      return;
    }

    const isMobile = digits.length === 11 && digits[2] === "9";
    const isLandline = digits.length === 10 && digits[2] !== "9";

    const valid = isMobile || isLandline;

    setError(!valid);
    onValidChange?.(valid);
  };

  return (
    <div className="wrapper">
      {label && <label htmlFor={id}>{label}</label>}

      <input
        type="text"
        id={id}
        placeholder="(00) 00000-0000"
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onChange={handleChange}
        maxLength={15}
      />

      {error && (
        <span className="error-text">
          {error}
        </span>
      )}
    </div>
  );
};