/* app/master/(auth)/login/masterLogin.tsx */

"use client";

import Link from "next/link";
import LinkButton from "@/components/buttons/LinkButton";
import Container from "@/components/container/Container";
import ForgotPassword from "@/components/buttons/ForgotPassword";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function MasterLoginPage() {
  return (
    <main className="auth-content">
      <TabTitle tabName="Login de Organizador"/>

      <LinkButton target="client" color="white" />

      <Container logo title="Log In como Organizador">
        <form className="column gap-5">
          
          {/* EMAIL INPUT */}
          <div>
            <label>Email</label>
            <input
              type="text"
              className="input"
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label>Senha</label>
            <div className="column gap-2">
              <input
                type="password"
                className="input"
                required
              />
              <ForgotPassword/>
            </div>
          </div>

          <div className="center gap-2">
            <span>
              Ainda não é um organizador?
            </span>

            <Link href="/master/register" className="underlined">
              Cadastre-se
            </Link>
          </div>

          <div className="column gap-1.5">
            <button type="submit" className="button default">
              Log In
            </button>

            <Link href="/admin/login" className="button clean">
              Log In como Admin
            </Link>
          </div>
        </form>
      </Container>
    </main>
  );
};