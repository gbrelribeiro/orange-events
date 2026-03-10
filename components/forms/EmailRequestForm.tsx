/* components/forms/EmailRequestForm.tsx */

import { useState, SyntheticEvent } from "react";
import Link from "next/link";

export default function EmailRequestForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/password/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao enviar email.");
        setLoading(false);
        return;
      };

      window.location.href = "/client/password/forgot-password/sent";
    } catch {
      setError("Erro ao processar solicitação.");
      setLoading(false);
    };
  };
  
  return (
    <form onSubmit={handleSubmit} className="column">
      <p className="text-sm text-center mb-5">
        Informe seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      {error && (
        <div className="error-input">
          {error}
        </div>
      )}

      <div className="column gap-5">
        <div className="column">
          <label>E-mail</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="column">
          <button 
            type="submit"
            className="button default" 
            disabled={loading || !email}
          >
            {loading ? "Enviando..." : "Enviar link de Redefinição"}
          </button>

          <div className="text-center mt-2">
            <Link 
              href="/client/login" 
              className="button clean"
            >
              Voltar para o Log In
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};