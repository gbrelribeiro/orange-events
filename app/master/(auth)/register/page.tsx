/* app/master/(auth)/register/page.tsx */

import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import { TabTitle } from "@/components/tabtitle/TabTitle";
import MasterRegisterForm from "@/components/forms/MasterRegisterForm";

export default function MasterRegisterPage() {
  return (
    <main className="auth-content">
      <TabTitle tabName="Cadastro de Organizador" />

      <LinkButton target="client" />

      <Container logo title="Cadastro Master" size="2xl">
        <MasterRegisterForm />
      </Container>
    </main>
  );
};