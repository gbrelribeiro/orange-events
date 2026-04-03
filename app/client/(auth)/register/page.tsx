/* app/client/(auth)/register/page.tsx */

"use client";

import Container from "@/components/container/Container";
import RegisterForm from "@/components/forms/RegisterForm";

export default function ClientRegister() {
  return (
    <div className="centered-content">
      
      {/* ADMIN LOGIN FORM CONTAINER */}
      <Container title="Log In" size="xl">
        <RegisterForm/>
      </Container>
    </div>
  );
};