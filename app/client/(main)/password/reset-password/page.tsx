/* app/client/(main)/password/reset-password/page.tsx */

"use client";

import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function ResetPassword() {
  return (
    <main className="center column">
      <TabTitle tabName="Alterar Senha"/>

      <LinkButton target="client-profile" />

      <div className="mt-10">
        <Container logo title="Alterar Senha" size="2xl">
          <ResetPasswordForm/>
        </Container>
      </div>
    </main>
  );
};