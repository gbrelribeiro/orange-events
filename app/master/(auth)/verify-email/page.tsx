/* app/master/(auth)/verify-email/page.tsx */

import LinkButton from "@/components/buttons/LinkButton";
import Container from "@/components/container/Container";
import VerifyEmailMasterContainer from "@/components/container/VerifyEmailMasterContainer";
import { TabTitle } from "@/components/tabtitle/TabTitle";
import { Suspense } from "react";

export default function VerifyEmailMasterPage() {
  return (
    <main>
      <TabTitle tabName="Confirmação de e-mail | Master"/>

      <Suspense fallback={
        <div className="auth-content">
          <LinkButton target="home"/>
          
          <Container logo title="Carregando" size="2xl">
            <p className="text-center">Validando acesso de Organizador...</p>
          </Container>
        </div>
      }>
        <VerifyEmailMasterContainer />
      </Suspense>
    </main>
  );
};