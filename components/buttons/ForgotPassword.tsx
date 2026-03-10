/* components/buttons/ForgotPassword.tsx */

import Link from "next/link";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  return (
    <Link href="/client/password/forgot-password/email-request" className="forgot-password-button">
      Esqueceu a senha?
    </Link>
  );
};