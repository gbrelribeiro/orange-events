/* components/inputs/ZipCode.tsx */

"use client";

import { useState, ChangeEvent } from "react";
import { addressSchema } from "@/lib/validations/auth/address";

const zipCodeFieldSchema = addressSchema.shape.zipCode;

type ZipCodeProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
};

export default function ZipCode({ id, label, value, onChange, onValidChange, onInteraction }: ZipCodeProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();
    
    let inputValue = e.target.value.replace(/\D/g, "");

    /* LIMITS TO 8 DIGITS */
    if (inputValue.length > 8) {
      inputValue = inputValue.slice(0, 8);
    }

    /* APPLY MASK */
    if (inputValue.length > 5) {
      inputValue = `${inputValue.slice(0, 5)}-${inputValue.slice(5)}`;
    }

    onChange(inputValue);
    validate(inputValue);
  };

  const validate = (value: string) => {
    if (!value) {
      setError(null);
      onValidChange?.(false);
      return;
    }

    const result = zipCodeFieldSchema.safeParse(value);

    if (result.success) {
      setError(null);
      onValidChange?.(true);
    } else {
      setError(result.error.issues[0].message);
      onValidChange?.(false);
    }
  };

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        id={id}
        placeholder="00000-000"
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onChange={handleChange}
        maxLength={9}
      />

      {error && (
        <span className="error-text">
          {error}
        </span>
      )}
    </div>
  );
};