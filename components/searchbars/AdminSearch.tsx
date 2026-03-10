/* components/searchbars/AdminSearch.tsx */

import { IoSearch } from "react-icons/io5";
import "./AdminSearch.css";

type AdminSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string | "";
};

export default function AdminSearch({ value, onChange, placeholder, disabled, className }: AdminSearchProps) {
  return (
    <div className={`admin-search-styles ${className}`}>
      <IoSearch className="admin-search-icon"/>
      
      <input 
        type="text" 
        placeholder={placeholder}
        className="input pl-10 pr-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}  
      />
    </div>
  );
};