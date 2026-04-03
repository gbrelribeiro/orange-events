/* components/inputs/BirthDate.tsx */

"use client";

import { useState, ChangeEvent } from "react";
import {birthDateSchema } from "@/lib/validations/auth/birthdate";
import { adultBirthDateSchema } from "@/lib/validations/auth/birthdate";

type BirthDateProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
  isAdultOnly?: boolean;
};

export default function BirthDate({ id, label, value, onChange, onValidChange, onInteraction, isAdultOnly = false }: BirthDateProps) {
  const [ error, setError ] = useState<string | null>(null);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();

    let input_value = e.target.value.replace(/\D/g, ""); /* REMOVE EVERYTHING THAT IS NOT A DIGIT */
    
    /* LIMITS TO 8 DIGITS (DD-MM-YYYY) */
    if (input_value.length > 8) {
      input_value = input_value.slice(0, 8);
    };
    
    /* MASK APPLICATION */
    if (input_value.length >= 5) {
      input_value = `${input_value.slice(0, 2)}/${input_value.slice(2, 4)}/${input_value.slice(4)}`;
    } else if (input_value.length >= 3) {
      input_value = `${input_value.slice(0, 2)}/${input_value.slice(2)}`;
    };
    
    onChange(input_value);
    validate(input_value);
  };

  const validate = (value: string) => {
    if (value.length === 0) {
      setError(null);
      onValidChange?.(false);
      return;
    };

    const schema = isAdultOnly ? adultBirthDateSchema : birthDateSchema;
    const result = schema.safeParse(value);

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
        placeholder="DD/MM/AAAA"
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onChange={handleChange}
        maxLength={10}
      />

      {error && (
        <span className="error-text">
          {error}
        </span>
      )}
    </div>
  );
};