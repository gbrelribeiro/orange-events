/* components/forms/NewPasswordForm.tsx */

import { useState, SyntheticEvent } from "react";
import PasswordRegister from "../inputs/PasswordRegister";
import Link from "next/link";

type NewPasswordFormProps = {
  token: string | null;
};

export default function NewPasswordForm ({ token }: NewPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(
    !token ? "Token não encontrado na URL." : null
  );
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password);

  
  
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setPasswordError(null);
    setConfirmError(null);

    if (!token) {
      setPasswordError("Token inválido.");
      return;
    };

    if (!isPasswordValid) {
      setPasswordError("A senha não atende aos requisitos.");
      return;
    };

    if (password !== confirmPassword) {
      setConfirmError("As senhas não coincidem.");
      return;
    };

    setLoading(true);

    try {
      const res = await fetch("/api/auth/password/reset-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Senha redefinida com sucesso! Faça login com sua nova senha.");
        window.location.href = "/client/login";
      } else {
        setPasswordError(data.error || "Erro ao redefinir senha.");
        setLoading(false);
      };
    } catch (error) {
      console.error(error);
      setPasswordError("Erro inesperado ao redefinir senha.");
      setLoading(false);
    };
  };
  
  return (
    <form onSubmit={handleSubmit} className="column gap-5">
      <p className="center text-sm">
        Escolha uma nova senha forte para sua conta.
      </p>
      <PasswordRegister
        value={password}
        onChange={(value) => {
          setPassword(value);
          if (passwordError) setPasswordError(null);
        }}
        error={passwordError}
      />
      <div className="column">
        <label>Confirmar nova senha</label>
        <input
          type="password"
          className={`input pl-2 pr-2 ${confirmError ? "error-input" : ""}`}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmError) setConfirmError(null);
          }}
        />
        {confirmError && <span className="error-text">{confirmError}</span>}
      </div>
      <div className="column gap-2">
        <button
          type="submit"
          className="button default"
          disabled={loading || !isPasswordValid || !confirmPassword}
        >
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
        <Link href="/client/login" className="button clean">
          Voltar para o Log In
        </Link>
      </div>
    </form>
  );
};