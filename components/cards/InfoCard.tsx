/* components/cards/InfoCard.tsx */

import "./InfoCard.css";

type InfoCardProps = {
  label: string;
  value: string | number;
  className?: string;
};

export default function InfoCard({ label, value, className = "" }: InfoCardProps) {
  return (
    <div className={`column ${className}`}>
      <p className="information">
        {label}
      </p>
      
      <p className="semibold-lg text-primary">
        {value}
      </p>
    </div>
  );
};