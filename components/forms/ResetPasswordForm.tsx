/* components/forms/ResetPasswordForm.tsx */

import { useState } from "react";
import PasswordRegister from "@/components/inputs/PasswordRegister";
import Link from "next/link";

export default function ResetPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
    const isPasswordValid =
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    /* CLEAN OLDERS MESSAGES */
    setCurrentPasswordError(null);
    setPasswordError(null);
    setConfirmError(null);
    setSuccessMessage(null);

    /* VALIDATIONS */
    if (!currentPassword) {
      setCurrentPasswordError("Informe sua senha atual.");
      return;
    };

    if (!isPasswordValid) {
      setPasswordError("A nova senha não atende aos requisitos.");
      return;
    };

    if (newPassword !== confirmPassword) {
      setConfirmError("As senhas não coincidem.");
      return;
    };

    if (currentPassword === newPassword) {
      setPasswordError("A nova senha deve ser diferente da senha atual.");
      return;
    };

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/password/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setCurrentPasswordError("Não autorizado. Faça login novamente.");
        } else if (data.error?.includes("Incorrect")) {
          setCurrentPasswordError("Senha atual incorreta.");
        } else {
          setPasswordError(data.error || "Erro ao redefinir senha.");
        };

        return;
      };

      /* SUCCESS */
      setSuccessMessage("Senha redefinida com sucesso!");
      
      /* CLEAN INPUTS */
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        window.location.href = "/client/profile";
      }, 2000);

    } catch (error) {
      console.error(error);
      setPasswordError("Erro inesperado ao redefinir senha.");
    } finally {
      setIsLoading(false);
    };
  };
  
  return (
    <form className="column" onSubmit={handleSubmit}>
      {/* SUCCESSFULLY MESSAGE */}
      {successMessage && (
        <div className="message confirm">
          {successMessage}
        </div>
      )}

      {/* ACTUALLY PASSWORD */}
      <div className="column">
        <label>Senha Atual</label>
        <input
          type="password"
          className={`input ${currentPasswordError ? "error-input" : ""}`}
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (currentPasswordError) setCurrentPasswordError(null);
          }}
        />
        
        {currentPasswordError && (
          <span className="error-text">
            {currentPasswordError}
          </span>
        )}

        <div className="mt-1">
          <Link 
            href="/client/password/forgot-password/email-request" 
            className="underlined text-base md:text-sm"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>

      {/* NEW PASSWORD */}
      <PasswordRegister
        value={newPassword}
        onChange={(value) => {
          setNewPassword(value);
          if (passwordError) setPasswordError(null);
        }}
        error={passwordError}
      />

      {/* CONFIRM NEW PASSWORD */}
      <div className="column-sm">
        <label>
          Confirmar Nova Senha
        </label>
        
        <input
          type="password"
          className={`input pl-2 pr-2 ${confirmError ? "input-error" : ""}`}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmError) setConfirmError(null);
          }}
        />

        {confirmError && (
          <span className="input-error-text">
            {confirmError}
          </span>
        )}
      </div>

      <div className="column-sm gap-2">
      {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="button mt-2"
          disabled={!isPasswordValid || isLoading || !currentPassword || !confirmPassword}
        >
          {isLoading ? "Salvando..." : "Salvar nova senha"}
        </button>

        {/* LINK FOR THE CLIENT PROFILE */}
        <Link href="/client/profile" className="clean-button">
          Cancelar
        </Link>
      </div>
    </form>
  );
};