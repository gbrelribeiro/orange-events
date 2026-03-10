/* _components/savedpassengers/SavedPassengers.tsx */

"use client";

import { useState } from "react";
import { FaUser, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { SavedCompanion } from "@/types/companion"; 
import "./SavedCompanions.css";

type SavedCompanionsProps = {
  savedCompanions: SavedCompanion[];
  onSelect: (passenger: SavedCompanion) => void;
  label?: string;
};

export default function SavedCompanions({savedCompanions, onSelect, label }: SavedCompanionsProps) {
  const [ isOpen, setIsOpen ] = useState(false);

  if (savedCompanions.length === 0) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return 0;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  
  return (
    <div className="saved-passenger-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="selector-toggle"
      >
        <span className="selector-label">
          <FaUser className="selector-icon" />
          {label}
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className="selector-dropdown">
          <div className="companion-list">
            {savedCompanions.map((companion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onSelect(companion);
                  setIsOpen(false);
                }}
                className="companion-item"
              >
                <div className="companion-info">
                  <div className="companion-name">
                    {companion.name}
                  </div>
                  
                  <div className="companion-details">
                    <span>
                      {formatDate(companion.birthdate)}
                    </span>
                    
                    <span>
                      {calculateAge(companion.birthdate)} anos
                    </span>
                    
                    <span>
                      CPF: {companion.document}
                    </span>

                    <span>
                      Contato: {companion.phone}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};