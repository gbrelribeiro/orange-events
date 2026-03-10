/* components/forms/ClientLoginForm.tsx */

"use client";

import { useState, SyntheticEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ForgotPassword from "../buttons/ForgotPassword";
import { ApiError } from "@/types/error";

export default function ClientLoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(null);
        setPasswordError(null);
        setIsLoading(false);

        if (data.issues?.length) {
          const issues: ApiError[] = data.issues;
          issues.forEach((issue) => {
            if (issue.field === "email") setEmailError(issue.message);
            if (issue.field === "password") setPasswordError(issue.message);
          });
          return;
        }

        if (data.error === "Email não encontrado.") {
          setEmailError(data.error);
          return;
        }

        if (data.error === "Senha incorreta.") {
          setPasswordError(data.error);
          return;
        }

        setPasswordError("Log in inválido.");
        return;
      }

      if (redirectUrl) window.location.href = decodeURIComponent(redirectUrl);
      else window.location.href = "/";
    
    } catch {
      setIsLoading(false);
      setPasswordError("Erro de conexão com o servidor.");
    };
  };

  return (
    <form className="column gap-5" onSubmit={handleSubmit}>
      <div className="column">
        <label htmlFor="Email">Email</label>
        <input 
          type="email" 
          className={`input ${emailError ? "error-input" : ""}`}
          value={email}
          onChange={(e) => { 
            setEmail(e.target.value); 
            if (emailError) setEmailError(null);
          }}
        />
        {emailError && <span className="error-text">{emailError}</span>}
      </div>

      <div className="column">
        <label htmlFor="Password">Senha</label>
        <input 
          type="password" 
          className={`input ${passwordError ? "error-input" : ""}`}
          value={password}
          onChange={(e) => { 
            setPassword(e.target.value); 
            if (passwordError) setPasswordError(null);
          }}
        />
        {passwordError && <span className="error-text">{passwordError}</span>}
        <ForgotPassword/>
      </div>

      <div className="center row gap-2">
        <p>
          Não possui uma conta?
        </p>
        
        <Link href="/client/register" className="underlined">
          Registrar-se
        </Link>
      </div>

      <button type="submit" className="button default" disabled={isLoading}>
        {isLoading ? "Carregando..." : "Log In"}
      </button>
    </form>
  );
};