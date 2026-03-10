/* components/buttons/CopyButton.tsx */

"use client";

import { useState } from "react";
import { MdContentCopy, MdCheck } from "react-icons/md";
import "./CopyButton.css";

type CopyButtonProps = {
  textToCopy: string;
  label?: string;
  iconSize?: number;
};

export default function CopyButton({ textToCopy, label, iconSize = 16 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);  
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar: ", err);
      alert("Não foi possível copiar o texto.");
    }
  };

  return (
    <button 
      onClick={handleCopy} 
      className={`copy-button ${copied ? "copied" : ""}`}
      type="button"
    >
      {copied ? (
        <MdCheck size={iconSize} className="copy-icon" />
      ) : (
        <MdContentCopy size={iconSize} className="copy-icon" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};