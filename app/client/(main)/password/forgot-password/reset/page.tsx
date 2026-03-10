/* app/client/(main)/password/forgot-password/reset/page.tsx */

"use client";

import {  Suspense } from "react"; 
import LinkButton from "@/components/buttons/LinkButton";
import ResetPasswordContainer from "@/components/container/ResetPasswordContainer";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function ResetForgotPasswordPage() {
  return (
    <main className="center column">
      <TabTitle tabName="Redefinir Senha"/>
      
      <Suspense fallback={<div className="center py-20"><p>Carregando ferramenta...</p></div>}>
        <LinkButton target="home" />
        
        <div className="mt-10">
          <ResetPasswordContainer />
        </div>
      </Suspense>
    </main>
  );
};