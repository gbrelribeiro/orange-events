/* components/counter/CompanionCounter.tsx */

"use client";

import { Counter } from "./Counter";
import "./CompanionCounter.css";

type CompanionCounterProps = {
  adults: number;
  childrenOver5: number;
  childrenUnder5: number;
  onAdultsChange: (value: number) => void;
  onChildrenOver5Change: (value: number) => void;
  onChildrenUnder5Change: (value: number) => void;
  totalPrice?: number;
  formatCurrency?: (value: number) => string;
  isHiddenEvent?: boolean;
};

export default function CompanionCounter({
  adults, 
  childrenOver5, 
  childrenUnder5, 
  onAdultsChange, 
  onChildrenOver5Change, 
  onChildrenUnder5Change,
  totalPrice,
  formatCurrency,
  isHiddenEvent = false
}: CompanionCounterProps) {

  // Lógica de soma total simplificada (Adultos + Crianças + Bebês)
  const totalCompanions = adults + childrenOver5 + childrenUnder5;

  return (
    <div className="companion-counter-container">
      <h1 className="companion-counter-title">
        Selecione a quantidade de acompanhantes
      </h1>

      <div className="space-y-3">
        
        {/* ADULTS / GLOBAL COUNTER */}
        <div className="companion-counter-item">
          <div className="companion-info">
            <span className="companion-label">
              {isHiddenEvent ? "Acompanhantes" : "Adultos"}
            </span>
          </div>

          <Counter
            label=""
            value={adults}
            onChange={onAdultsChange}
            minValue={1}
            errorMessage="Mínimo de 1 ingresso"
          />
        </div>

        {/* Renderização condicional apenas baseada em isHiddenEvent */}
        {!isHiddenEvent && (
          <>
            {/* CHILDREN OVER 5 YEARS */}
            <div className="companion-counter-item">
              <div className="companion-info">
                <span className="companion-label">Crianças</span>
                <span className="companion-description">5 à 17 anos</span>
              </div>
              <Counter
                label=""
                value={childrenOver5}
                onChange={onChildrenOver5Change}
                minValue={0}
              />
            </div>

            {/* CHILDREN UNDER 5 YEARS */}
            <div className="companion-counter-item">
              <div className="companion-info">
                <span className="companion-label">Bebês</span>
                <span className="companion-description">Até 4 anos</span>
              </div>
              <Counter
                label=""
                value={childrenUnder5}
                onChange={onChildrenUnder5Change}
                minValue={0}
              />
            </div>
          </>
        )}
      </div>

      {/* TOTAL COMPANIONS AND PRICE */}
      <div className="companion-counter-division">
        <div className="between">
          <span className="font-medium">
            Total de acompanhantes:
          </span>
          <span className="font-semibold">
            {totalCompanions}
          </span>
        </div>

        {totalPrice !== undefined && formatCurrency && (
          <div className="between">
            <span className="font-medium">
              Valor total:
            </span>
            <span className="font-bold text-xl text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}