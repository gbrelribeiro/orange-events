/* components/forms/MasterRegisterForm.tsx */

"use client";

import { useState, SyntheticEvent } from "react";
import Link from "next/link";
import StepIndicator from "../stepindicator/StepIndicator";
import Email from "../inputs/Email";
import PasswordRegister from "../inputs/PasswordRegister";
import { ApiError } from "@/types/error";

export default function MasterRegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* REGISTER STEP */
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isStep1Valid = 
    firstName.trim() && 
    lastName.trim() && 
    organizationName.length >= 5;

  const isStep2Valid = 
    isValidEmail && 
    password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[0-9]/.test(password);

  const handleNextStep = () => {
    setStepError(null);

    if (step === 1 && !isStep1Valid) {
      setStepError("Preencha todos os campos corretamente. O nome da organização deve ter pelo menos 5 caracteres.");
      return;
    };

    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);
    setStepError(null);

    if (!isStep1Valid || !isStep2Valid) {
      setStepError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    };

    const res = await fetch("/api/auth/master/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        organizationName,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setEmailError(null);
      setPasswordError(null);
      setIsLoading(false);

      if (data.issues?.length) {
        data.issues.forEach((issue: ApiError) => {
          if (issue.field === "email") setEmailError(issue.message);
          if (issue.field === "password") setPasswordError(issue.message);
          if (issue.field === "organizationName") setGeneralError(issue.message);
        });
        return;
      };

      setGeneralError(data.error || "Erro interno ao processar cadastro.");
      return;
    };

    window.location.href = "/master/register/success";
  };

  return (
    <>
      {/* Usando o StepIndicator dinâmico que ajustamos com 2 etapas */}
      <StepIndicator currentStep={step} totalSteps={2} />

      {stepError && (
        <div className="message error mb-5">
          {stepError}
        </div>
      )}

      {generalError && (
        <div className="message error mb-5">
          {generalError}
        </div>
      )}

      <form className="column gap-5" onSubmit={handleSubmit}>
        
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="title text-center mb-10">
              Dados da Organização
            </h1>

            <div>
              <label>Nome da Organização</label>
              <input
                className="input"
                value={organizationName}
                onChange={(e) => {
                  setOrganizationName(e.target.value);
                  if (stepError) setStepError(null);
                }}
              />
            </div>

            <div className="row gap-2">
              <div className="w-full">
                <label>Nome do Responsável</label>
                <input
                  className="input"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                />
              </div>

              <div className="w-full">
                <label>Sobrenome</label>
                <input
                  className="input"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="title text-center mb-10">
              Credenciais de Acesso
            </h1>

            <Email
              label="Email Corporativo"
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (emailError) setEmailError(null);
                if (stepError) setStepError(null);
              }}
              onValidChange={setIsValidEmail}
            />

            <PasswordRegister
              value={password}
              onChange={(value) => {
                setPassword(value);
                if (passwordError) setPasswordError(null);
                if (stepError) setStepError(null);
              }}
              error={passwordError}
            />
          </>
        )}

        <div className="center row gap-2">
          <p>Já possui uma conta Master?</p>
          <Link href="/master/login" className="underlined">
            Log In
          </Link>
        </div>

        {/* NAVEGATION CONTROLS */}
        <div className="row gap-2">
          {step > 1 && (
            <button 
              type="button" 
              className="button clean" 
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              className="button default flex-1"
              onClick={handleNextStep}
            >
              Próximo
            </button>
          ) : (
            <button
              type="submit"
              className="button default flex-1"
              disabled={!isStep2Valid || isLoading}
            >
              {isLoading ? "Processando..." : "Finalizar Cadastro"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};