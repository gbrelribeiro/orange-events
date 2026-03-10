/* components/forms/ClientRegisterForm.tsx */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import StepIndicator from "../stepindicator/StepIndicator";
import Email from "../inputs/Email";
import PasswordRegister from "../inputs/PasswordRegister";
import Phone from "../inputs/Phone";
import BirthDate from "../inputs/BirthDate";
import Identity from "../inputs/Identity";
import Document from "../inputs/Document";
import { StateSelector } from "../location/StateSelector";
import { CitySelector } from "../location/CitySelector";
import HouseNumber from "../inputs/HouseNumber";
import ZipCode from "../inputs/ZipCode";
import { ApiError } from "@/types/error";

export default function ClientRegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [document, setDocument] = useState("");
  const [identity, setIdentity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidBirthDate, setIsValidBirthDate] = useState(false);
  const [isValidDocument, setIsValidDocument] = useState(false);
  const [isValidIdentity, setIsValidIdentity] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isValidZipCode, setIsValidZipCode] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isValidPassword = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  /* REGISTER STEP */
  const [step, setStep] = useState(1);

  const [stepError, setStepError] = useState<string | null>(null);

  const isStep1Valid =
    firstName.trim() &&
    lastName.trim() &&
    isValidBirthDate &&
    isValidDocument &&
    isValidIdentity;

  const isStep2Valid =
    isValidPhone &&
    isValidEmail &&
    isValidPassword;

  const isStep3Valid =
    state &&
    city &&
    isValidZipCode &&
    isValidNumber &&
    street.trim() &&
    neighborhood.trim();
  
  const handleNextStep = () => {
    setStepError(null);

    if (step === 1 && !isStep1Valid) {
      setStepError("Preencha todos os campos obrigatórios para continuar.");
      return;
    }

    if (step === 2 && !isStep2Valid) {
      setStepError("Preencha todos os campos obrigatórios para continuar.");
      return;
    }

    if (step === 3 && !isStep3Valid) {
      setStepError("Preencha todos os campos obrigatórios para continuar.");
      return;
    }

    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  /* HANDLES */
  const handleStateChange = useCallback((val: string) => {
    setState(val);
  }, []);

  const handleCityChange = useCallback((val: string) => {
    setCity(val);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (
      !isValidBirthDate || 
      !isValidDocument || 
      !isValidIdentity || 
      !isValidPhone || 
      !state || 
      !city || 
      !isValidNumber||
      !isValidZipCode ||
      !neighborhood ||
      !street
    ) {
      alert("Por favor, preencha todos os campos corretamente, incluindo Estado e Cidade.");
      setIsLoading(false);
      return;
    };

    const res = await fetch("/api/auth/client/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        birthDate,
        document,
        identity,
        phone,
        email,
        password,
        address: {
          zipCode,
          street,
          number,
          neighborhood,
          city,
          state,
          complement,
        }, 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setEmailError(null);
      setPasswordError(null);
      setIsLoading(false);

      if (data.issues?.length) {
        const issues: ApiError[] = data.issues;
        issues.forEach((issue) => {
          if (issue.field === "email") setEmailError(issue.message);
          if (issue.field === "password") setPasswordError(issue.message);
        });
        return;
      };

      if (data.error === "Email já registrado.") {
        setEmailError(data.error);
        return;
      };

      setPasswordError(data.error || "Senha inválida.");
      return;
    }

    window.location.href = "/client/register/success";
  };
  
  return (
    <>
      <StepIndicator currentStep={step} />
      {stepError && (
        <div className="message error mb-5">
          {stepError}
        </div>
      )}
          
      <form className="column gap-5" onSubmit={handleSubmit}>
        
        {/* STEP 1 — PERSONAL DATA */}
        {step === 1 && (
          <>
            <h1 className="title text-center mb-10">
              Dados Pessoais
            </h1>

            <div className="row gap-2">
              <div className="w-full">
                <label>Nome</label>
                <input
                  className="input pl-2 pr-2 w-full"
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
                  className="input pl-2 pr-2 w-full"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value); 
                    if (stepError) setStepError(null);
                  }}
                />
              </div>
            </div>

            <BirthDate
              label="Data de Nascimento"
              value={birthDate}
              onChange={setBirthDate}
              onValidChange={setIsValidBirthDate}
              onInteraction={() => {
                if (stepError) setStepError(null);
              }}
              isAdultOnly={true}
            />

            <Document
              label="CPF"
              value={document}
              onChange={setDocument}
              onValidChange={setIsValidDocument}
              onInteraction={() => {
                if (stepError) setStepError(null);
              }}
            />

            <Identity
              label="RG"
              value={identity}
              onChange={setIdentity}
              onValidChange={setIsValidIdentity}
              onInteraction={() => {
                if (stepError) setStepError(null);
              }}
            />
          </>
        )}

        {/* STEP 2 — CONTACT */}
        {step === 2 && (
          <>
            <h1 className="title text-center">
              Contato
            </h1>

            <Phone
              label="Telefone"
              value={phone}
              onChange={setPhone}
              onValidChange={setIsValidPhone}
              onInteraction={() => {
                if (stepError) setStepError(null);
              }}
            />

            {/* EMAIL */}
            <Email
              label="Email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (emailError) setEmailError(null);
                if (stepError) setStepError(null);
              }}
              onValidChange={setIsValidEmail}
            />

            {/* PASSWORD INPUT COMPONENT */}
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

        {/* STEP 3 - ADDRESS */}
        {step === 3 && (
          <>
            <h1 className="title text-center">
              Endereço
            </h1>

            <div className="row">
              {/* STATE SELECTOR COMPONENT */}
              <div className="w-full">
                <label>Estado</label>
                <StateSelector
                  value={state}
                  onChange={handleStateChange}
                />
              </div>

              {/* CITY SELECTOR COMPONENT */}
              <div className="w-full">
                <label>Cidade</label>
                <CitySelector
                  selectedState={state}
                  value={city}
                  onChange={handleCityChange}
                />
              </div>
            </div>

            {/* ZIP CODE INPUT */}
            <ZipCode 
              id="ZipCode"
              label="CEP"
              value={zipCode} 
              onChange={setZipCode}
              onValidChange={setIsValidZipCode}
              onInteraction={() => {
                if (stepError) setStepError(null);
              }}
            />

            {/* ADDRESS STREET INPUT */}
            <div>
              <label>Rua/Avenida</label>
              <input 
                type="text" 
                className="input pl-2 pr-2"
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value); 
                  if (stepError) setStepError(null);
                }}
              />
            </div>

            <div className="row">
              {/* HOUSE NUMBER COMPONENT */}
              <HouseNumber 
                id="HouseNumber"
                label="Número"
                value={number} 
                onChange={setNumber}
                onValidChange={setIsValidNumber}
                onInteraction={() => {
                  if (stepError) setStepError(null);
                }}
              />

              {/* NEIGHBORHOOD INPUT */}
              <div>
                <label>Bairro</label>
                <input 
                  type="text" 
                  className="input pl-2 pr-2 w-full"
                  value={neighborhood}
                  onChange={(e) => {
                    setNeighborhood(e.target.value); 
                    if (stepError) setStepError(null);
                  }}
                />
              </div>
            </div>

            {/* ADDRESS COMPLEMENT (OPTIONAL)*/}
            <div>
              <label>Complemento (Opcional)</label>
              <input 
                type="text" 
                className="input pl-2 pr-2"
                value={complement}
                onChange={(e) => {
                  setComplement(e.target.value); 
                  if (stepError) setStepError(null);
                }}
              />
            </div>
          </>
        )}

        <div className="center row gap-2">
          <p>Já possui uma conta?</p>
          <Link href="/client/login" className="underlined">
            Log In
          </Link>
        </div>

        {/* REGISTER SUBMIT BUTTON */}
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

          {step < 3 ? (
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
              disabled={!isStep3Valid || isLoading}
            >
              {isLoading ? "Carregando..." : "Registrar"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};