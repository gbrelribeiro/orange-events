/* app/client/(auth)/login/page.tsx */

"use client";

import Container from "@/components/container/Container";
import LoginForm from "@/components/forms/LoginForm";

export default function ClientLogin() {
  return (
    <div className="centered-content">
      
      {/* ADMIN LOGIN FORM CONTAINER */}
      <Container title="Log In" size="xl">
        <LoginForm/>
      </Container>
    </div>
  );
};