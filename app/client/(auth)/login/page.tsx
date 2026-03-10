/* app/client/(auth)/login/page.tsx */

"use client";

import { Suspense } from "react";
import LinkButton from "@/components/buttons/LinkButton";
import { TabTitle } from "@/components/tabtitle/TabTitle";
import ClientLoginForm from "@/components/forms/ClientLoginForm";
import Container from "@/components/container/Container";

export default function ClientLoginPage() {
  return (
    <main>
      <TabTitle tabName="Log In de Cliente"/>
      
      <Suspense fallback={<div className="center py-20">Carregando formulário...</div>}>
        <div className="auth-content">
          <LinkButton target="home"/>

          <Container logo title="Log In como Cliente" size="2xl">
            <ClientLoginForm />
          </Container>

          <LinkButton target="master"/>
        </div>
      </Suspense>
    </main>
  );
};