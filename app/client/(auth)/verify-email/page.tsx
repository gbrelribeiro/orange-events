/* app/client/(auth)/verify-email/page.tsx */

import LinkButton from "@/components/buttons/LinkButton";
import Container from "@/components/container/Container";
import VerifyEmailClientContainer from "@/components/container/VerifyEmailClientContainer";
import { TabTitle } from "@/components/tabtitle/TabTitle";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <main>
      <TabTitle tabName="Confirmação de e-mail"/>

      <Suspense fallback={
        <div className="auth-content">
          <LinkButton target="home"/>
          
          <Container logo title="Carregando" size="2xl">
            <p className="text-center">Validando token...</p>
          </Container>
        </div>
      }>
        <VerifyEmailClientContainer />
      </Suspense>
    </main>
  );
};