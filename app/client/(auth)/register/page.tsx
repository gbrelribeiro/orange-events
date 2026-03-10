/* app/client/(auth)/register/clientRegister.tsx */

"use client";

import LinkButton from "@/components/buttons/LinkButton";
import Container from "@/components/container/Container";
import ClientRegisterForm from "@/components/forms/ClientRegisterForm";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function ClientRegisterPage() {
  return (
    <main>
      <TabTitle tabName="Cadastro de Cliente"/>

      <div className="auth-content">
        <LinkButton target="home" />

        <Container logo title="Cadastro de Cliente" size="2xl">
          <ClientRegisterForm/>
        </Container>
      </div>
    </main>
  );
};