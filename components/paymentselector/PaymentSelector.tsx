/* components/paymentselector/PaymentSelector.tsx */

"use client";

import { FaPix, FaCreditCard } from "react-icons/fa6";
import { formatCurrency } from "@/utils/formatCurrency";
import "./PaymentSelector.css";

export type PaymentMethod = "PIX" | "INSTALLMENTS";

type PaymentSelectorProps = {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  installments: number;
  onInstallmentsChange: (installments: number) => void;
  cashPrice: number;
  installmentPrice: number;
  maxInstallments?: number;
};

export default function PaymentSelector({
  selectedMethod,
  onMethodChange,
  installments,
  onInstallmentsChange,
  cashPrice,
  installmentPrice,
  maxInstallments = 10, /* INSTALLMENTS MAXIMUM QUANTITY */
}: PaymentSelectorProps) {
  
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1);

  const priceForInstallments = installmentPrice;

  return (
    <div className="payment-selector-container">
      <h3 className="payment-selector-title">
        Forma de Pagamento
      </h3>

      {/* PAYMENT METHODS */}
      <div className="payment-methods-grid">
        {/* PIX */}
        <button
          type="button"
          onClick={() => {
            onMethodChange("PIX");
            onInstallmentsChange(1);
          }}
          className={`payment-method-card ${selectedMethod === "PIX" ? "selected" : ""}`}
        >
          <FaPix className="payment-icon" />
          <span className="payment-method-name">
            PIX
          </span>
        </button>

        {/* CREDIT CARD - INSTALLMENTS */}
        {maxInstallments && maxInstallments > 1 ? (
          <button
            type="button"
            onClick={() => onMethodChange("INSTALLMENTS")}
            className={`payment-method-card ${selectedMethod === "INSTALLMENTS" ? "selected" : ""}`}
          >
            <FaCreditCard className="payment-icon" />
            <span className="payment-method-name">
              Crédito
            </span>
          </button>
        ) : (
          <div className="payment-method-card disabled opacity-50 cursor-not-allowed">
            <FaCreditCard className="payment-icon" />
            <span className="payment-method-name">
              Crédito (Indisponível)
            </span>
          </div>
        )}
      </div>

      {/* INSTALLMENTS SELECTOR (ONFLY FOR CREDIT CARD) */}
      {selectedMethod === "INSTALLMENTS" && (
        <div className="installments-container">
          <label className="installments-label">
            Número de Parcelas
          </label>
          <select
            value={installments}
            onChange={(e) => onInstallmentsChange(Number(e.target.value))}
            className="installments-select"
          >
            {installmentOptions.map((num) => (
              <option key={num} value={num}>
                {num}x de {formatCurrency(priceForInstallments / num)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* PAYMENT SUMMARY */}
      <div className="payment-summary">
        {selectedMethod === "PIX" ? (
          <div className="payment-summary-text">
            Total: <span className="payment-total">{formatCurrency(cashPrice)}</span>
          </div>
        ) : (
          <div className="payment-summary-text">
            {installments}x de{" "}
            <span className="payment-total">{formatCurrency(priceForInstallments / installments)}</span>
            <span className="payment-total-small">
              (Total: {formatCurrency(priceForInstallments)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};