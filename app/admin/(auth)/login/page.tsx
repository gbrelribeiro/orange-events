/* app/admin/(auth)/login/page.tsx */

"use client";

import Link from "next/link";
import Container from "@/components/container/Container";
import LinkButton from "@/components/buttons/LinkButton";
import AdminLoginForm from "@/components/forms/AdminLoginForm";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function AdminLogin() {
  return (
    <div className="auth-content">
      <TabTitle tabName="Log In de Admin"/>
      
      {/* LINK BUTTON FOR BACK TO HOME PAGE */}
      <LinkButton target="client" color="white"/>
      
      {/* ADMIN LOGIN FORM CONTAINER */}
      <Container logo title="Log In como Admin" size="2xl">
        <AdminLoginForm/>

        <Link href="/master/login" className="button clean">
          Log In como Organizador
        </Link>
      </Container>
    </div>
  );
};