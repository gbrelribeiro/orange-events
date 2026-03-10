/* app/client/(main)/password/forgot-password/sent/page.tsx */

"use client";

import Link from "next/link";
import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function ForgotPasswordSent() {
  return (
    <main className="center column">
      <TabTitle tabName="Email Enviado"/>

      <LinkButton target="home" />

      <div className="mt-10">
        <Container logo title="Verifique seu e-mail" size="2xl">
          <div className="column text-center gap-3">

            <p>
              Se o e-mail informado estiver cadastrado em nosso sistema, 
              você receberá um link para redefinir sua senha.
            </p>

            <div className="message warning">
                <strong>
                  O link expira em 1 hora
                </strong>
            </div>

            <p className="information">
              Não se esqueça de verificar sua caixa de spam ou lixo eletrônico.
            </p>

            <div  className="column mt-2">
              <p className="information">
                Não recebeu o email?
              </p>
              <Link 
                href="/client/password/forgot-password/email-request"
                className="button clean"
              >
                Reenviar email
              </Link>
            </div>

            <Link 
              href="/client/login" 
              className="button default"
            >
              Voltar para o Log In
            </Link>
          </div>
        </Container>
      </div>
    </main>
  );
};