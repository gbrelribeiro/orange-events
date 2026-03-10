/* components/eventdate/EventDate.tsx */

"use client";

import { useState, ChangeEvent } from "react";
import "./EventDate.css";

type EventDateProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  minDate?: string;
  placeholder?: string;
};

export default function EventDate({ id, label, value, onChange, onValidChange, minDate, placeholder = "DD/MM/AAAA" }: EventDateProps) {
  const [error, setError] = useState<string | null>(null);

  let displayValue = value || "";
  if (displayValue.includes("-")) {
    const datePart = displayValue.split("T")[0];
    const [year, month, day] = datePart.split("-");
    if (year && month && day) displayValue = `${day}/${month}/${year}`;
  }

  const validate = (val: string) => {
    if (val.length === 0) {
      setError(null);
      onValidChange?.(false);
      return;
    }

    if (val.length !== 10) {
      setError("Data incompleta");
      onValidChange?.(false);
      return;
    }

    const [d, m, y] = val.split("/").map(Number);
    const selectedDate = new Date(y, m - 1, d);
    
    if (isNaN(selectedDate.getTime()) || m < 1 || m > 12 || d < 1 || d > 31) {
      setError("Data inválida");
      onValidChange?.(false);
      return;
    }

    const daysInMonth = new Date(y, m, 0).getDate();
    if (d > daysInMonth) {
      setError("Dia inválido para este mês.");
      onValidChange?.(false);
      return;
    }

    if (minDate && minDate.length === 10) {
      const [minD, minM, minY] = minDate.split("/").map(Number);
      const minimumDate = new Date(minY, minM - 1, minD);
      if (selectedDate < minimumDate) {
        setError("A data de retorno não pode ser anterior à de início.");
        onValidChange?.(false);
        return;
      }
    }

    setError(null);
    onValidChange?.(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let input_value = e.target.value.replace(/\D/g, "");
    if (input_value.length > 8) input_value = input_value.slice(0, 8);
    
    if (input_value.length >= 5) {
      input_value = `${input_value.slice(0, 2)}/${input_value.slice(2, 4)}/${input_value.slice(4)}`;
    } else if (input_value.length >= 3) {
      input_value = `${input_value.slice(0, 2)}/${input_value.slice(2)}`;
    }
    
    onChange(input_value);
    validate(input_value);
  };

  return (
    <div className="event-date-container">
      {label && <label htmlFor={id} className="event-date-label">{label}</label>}
      <input 
        type="text" 
        id={id}
        placeholder={placeholder}
        className={`input ${error ? "error-input" : ""}`}
        value={displayValue}
        onChange={handleChange}
        maxLength={10}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};