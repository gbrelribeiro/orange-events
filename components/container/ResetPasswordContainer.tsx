/* components/container/ResetPasswordContainer.tsx */

import { useSearchParams } from "next/navigation";
import Container from "./Container";
import LinkButton from "../buttons/LinkButton";
import Link from "next/link";
import NewPasswordForm from "../forms/NewPasswordForm";

export default function ResetPasswordContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tokenValid = !!token;

  if (!tokenValid) {
    return (
      <main className="center column">
        <LinkButton target="home" />
        <div className="mt-10">
          <Container logo title="Link Inválido" size="2xl">
            <div className="column-sm text-center">
              <p className="text-base mb-4">
                O link de redefinição de senha é inválido ou não foi encontrado.
              </p>
              <Link
                href="/client/password/forgot-password/email-request"
                className="button inline-block"
              >
                Solicitar novo link
              </Link>
              <div className="mt-4">
                <Link
                  href="/client/login"
                  className="text-sm opacity-70 hover:opacity-100"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </main>
    );
  };

  return (
    <Container logo title="Redefinir senha" size="2xl">
      <NewPasswordForm token={token}/>
    </Container>
  );
};