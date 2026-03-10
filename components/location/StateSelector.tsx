/* components/location/StateSelector.tsx */

import states from "@/utils/states";

type StateSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string | "";
};

export const StateSelector = ({ value, onChange, className }: StateSelectorProps) => {
  return (
    <select 
      className={`${className} input`}
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option>
        Estado
      </option>
      
      {states.map((state) => (
        <option key={state.value} value={state.value}>
          {state.label}
        </option>
      ))};
    </select>
  );
};