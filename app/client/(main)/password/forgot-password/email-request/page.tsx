/* app/client/(main)/password/forgot-password/email-request/page.tsx */

"use client";

import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import EmailRequestForm from "@/components/forms/EmailRequestForm";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function ForgotPassword() {
  return (
    <main className="center column">
      <TabTitle tabName="Esqueci minha Senha"/>

      <LinkButton target="home" />

      <div className="mt-10">
        <Container logo title="Esqueceu sua senha?" size="2xl">
          <EmailRequestForm/>
        </Container>
      </div>
    </main>
  );
};