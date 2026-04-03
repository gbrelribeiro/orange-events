/* app/client/(auth)/register/page.tsx */

"use client";

import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import ClientRegisterForm from "@/components/forms/ClientRegisterForm";

export default function ClientRegister() {
  return (
    <div className="centered-content">
      <LinkButton target="home" />
      
      <Container title="Cadastro de Cliente" size="xl">
        <ClientRegisterForm/>
      </Container>
    </div>
  );
};