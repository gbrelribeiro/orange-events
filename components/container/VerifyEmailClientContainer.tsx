/* components/container/VerifyEmailClientContainer.tsx */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "./Container";
import { FaCheck } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

export default function VerifyEmailClientContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("Token não informado.");
        return;
      };

      try {
        const res = await fetch(
          "/api/auth/client/register/confirm-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Falha ao confirmar e-mail.");
          return;
        }

        setStatus("success");
        setMessage("E-mail confirmado com sucesso!");
      } catch {
        setStatus("error");
        setMessage("Erro inesperado ao confirmar e-mail.");
      };
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="auth-content">
      <Container logo title="Confirmação de e-mail" size="2xl">
        <div className="column gap-5 text-center">
          {status === "loading" && (<p>Confirmando seu e-mail...</p>)}

          {status === "success" && (
            <>
              <div className="row center">
                {message} <FaCheck size={24} className="confirmation-text"/>
              </div>
              <p>Sua conta já está ativa.</p>
              <Link href="/client/login" className="button">
                Ir para o login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="message-error">
                {message} <TbCancel size={24} className="negation-text"/>
              </div>
              <p>O link pode ter expirado ou já foi utilizado.</p>
              <Link href="/client/login" className="button">
                Voltar para o login
              </Link>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};