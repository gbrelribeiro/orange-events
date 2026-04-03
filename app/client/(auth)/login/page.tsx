/* app/client/(auth)/login/page.tsx */

"use client";

import Container from "@/components/container/Container";
import ClientLoginForm from "@/components/forms/ClientLoginForm";

export default function ClientLogin() {
  return (
    <div className="centered-content">
      
      {/* ADMIN LOGIN FORM CONTAINER */}
      <Container title="Log In" size="xl">
        <ClientLoginForm/>
      </Container>
    </div>
  );
};