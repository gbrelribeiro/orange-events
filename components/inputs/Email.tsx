/* components/inputs/Email.tsx */

"use client";

import { ChangeEvent, useState } from "react";
import { emailSchema } from "@/lib/validations/auth/email";

type EmailProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  onInteraction?: () => void;
};

export default function Email({ id, label, value, onChange, onValidChange, onInteraction }: EmailProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInteraction?.();

    const email = e.target.value;

    onChange(email);
    validate(email);
  };

  const validate = (value: string) => {
    if (!value.trim()) {
      setError(null);
      onValidChange?.(false);
      return;
    };

    const result = emailSchema.safeParse(value);

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
        type="email"
        id={id}
        className={`input ${error ? "error-input" : ""}`}
        value={value}
        onChange={handleChange}
      />

      {error && (
      <span className="error-text">
          {error}
        </span>
      )}
    </div>
  );
};