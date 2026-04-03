/* components/inputs/Counter.tsx */

"use client";

import { LuMinus, LuPlus } from "react-icons/lu";
import "./Counter.css";

type CounterProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  errorMessage?: string;
};

export function Counter({ label, value, onChange, minValue = 1, errorMessage = "Invalid value" }: CounterProps) {
  const showError = value < minValue;
  
  return (
    <div className="button-position">

      {/* COUNTER BUTTON LABLE */}
      <div className="between">
        <span className="font-medium">
          {label}
        </span>

        {showError && (
          <span className="flex input-error-text text-sm mr-5">
            {errorMessage}
          </span>
        )}
      </div>

      <div className="plus-and-minus-space">
        
        {/* MINUS (-) BUTTON */}
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="counter-button"
        >
          <LuMinus size={16} />
        </button>

        {/* COUNTER VALUE */}
        <span className="number-display">
          {value}
        </span>

        {/* PLUS (+) BUTTON */}
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="counter-button"
        >
          <LuPlus size={16} />
        </button>
      </div>
    </div>
  );
};