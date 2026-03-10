/* app/client/(auth)/register/success/page.tsx */

"use client";

import Link from "next/link";
import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function RegisterClientSuccessPage() {
  return (
    <div className="auth-content">
      <TabTitle tabName="Cadastro Realizado"/>

      <LinkButton target="home" />

      <Container logo title="Cadastro realizado" size="2xl">
        <div className="column gap-5 text-center">
          <p>
            Enviamos um <strong>e-mail de confirmação</strong> para o endereço informado.
          </p>

          <p>
            Para ativar sua conta, clique no link enviado para o e-mail cadastrado.
          </p>

          <div className="text-neutral-600 text-sm">
            Verifique também a caixa de spam ou promoções.
          </div>

          <Link href="/client/login" className="button default">
            Ir para o login
          </Link>
        </div>
      </Container>
    </div>
  );
};