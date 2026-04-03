/* components/inputs/HouseNumber.tsx */

"use client";

import { useState, ChangeEvent } from "react";
import { addressSchema } from "@/lib/validations/auth/address";

const houseNumberFieldSchema = addressSchema.shape.number;

type HouseNumberProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
};

export default function HouseNumber({ id, label, value, onChange, onValidChange, onInteraction }: HouseNumberProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();
    
    let inputValue = e.target.value.replace(/\D/g, "");

    if (inputValue.startsWith("0")) {
      inputValue = inputValue.replace(/^0+/, "");
    }

    onChange(inputValue);
    validate(inputValue);
  };

  const validate = (value: string) => {
    if (!value) {
      setError(null);
      onValidChange?.(false);
      return;
    };

    const result = houseNumberFieldSchema.safeParse(value);

    if (result.success) {
      setError(null);
      onValidChange?.(true);
    } else {
      setError(result.error.issues[0].message);
      onValidChange?.(false);
    };
  };

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        id={id}
        inputMode="numeric"
        placeholder="N°"
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onChange={handleChange}
      />

      {error && 
        <span className="error-text">
          {error}
        </span>}
    </div>
  );
};