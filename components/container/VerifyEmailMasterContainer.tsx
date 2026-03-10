/* components/container/VerifyEmailMasterContainer.tsx */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "./Container";
import { FaCheck } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

export default function VerifyEmailMasterContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("Token de mestre não informado.");
        return;
      };

      try {
        const res = await fetch(
          "/api/auth/master/register/confirm-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Falha ao confirmar e-mail do Master.");
          return;
        };

        setStatus("success");
        setMessage("E-mail Master confirmado com sucesso!");
      } catch {
        setStatus("error");
        setMessage("Erro inesperado na verificação Master.");
      };
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="auth-content">
      <Container logo title="Verificação Master" size="2xl">
        <div className="column gap-5 text-center">
          {status === "loading" && (<p>Validando credenciais de administrador...</p>)}

          {status === "success" && (
            <>
              <div className="row center">
                {message} <FaCheck size={24} className="confirmation-text"/>
              </div>
              <p>Sua conta administrativa está ativa e pronta para uso.</p>
              <Link href="/master/login" className="button">
                Acessar Painel Master
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="message-error">
                {message} <TbCancel size={24} className="negation-text"/>
              </div>
              <p>O link expirou ou o token não pertence a um perfil Master.</p>
              <Link href="/master/login" className="button">
                Voltar para o login
              </Link>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};