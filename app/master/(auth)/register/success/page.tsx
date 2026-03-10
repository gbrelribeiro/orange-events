/* app/master/(auth)/register/success/page.tsx */

import Link from "next/link";
import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function RegisterMasterSuccessPage() {
  return (
    <div className="auth-content">
      <TabTitle tabName="Cadastro de Organizador"/>

      <LinkButton target="home" />

      <Container logo title="Quase lá, Organizador!" size="2xl">
        <div className="column gap-5 text-center">
          <p>
            O seu cadastro de organizador foi recebido com sucesso.
          </p>

          <div className="message success">
            Enviamos um link de ativação para o seu e-mail.
          </div>

          <p className="text-sm">
            Como uma conta de Organizador, após verificar seu email,
            precisamos avaliar sua conta para você poder começar a criar eventos.
          </p>

          <Link href="/master/login" className="button default mt-5">
            Ir para o login de Organizador
          </Link>
        </div>
      </Container>
    </div>
  );
};