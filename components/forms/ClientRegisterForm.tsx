/* components/forms/ClientRegisterForm.tsx */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* COMPONENTES DE INPUT */
import BirthDate from "../inputs/Birthdate";
import Document from "../inputs/Document";
import Identity from "../inputs/Identity";
import Phone from "../inputs/Phone";
import Email from "../inputs/Email";
import PasswordRegister from "../inputs/PasswordRegister";
import ZipCode from "../inputs/ZipCode";
import HouseNumber from "../inputs/HouseNumber";
import { StateSelector } from "../location/StateSelector";
import { CitySelector } from "../location/CitySelector";
import StepIndicator from "../stepindicator/StepIndicator";
import { ApiError } from "@/types/error";

export default function ClientRegisterForm() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

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

  /* VALIDATION STATES */
  const [isValidBirthDate, setIsValidBirthDate] = useState(false);
  const [isValidDocument, setIsValidDocument] = useState(false);
  const [isValidIdentity, setIsValidIdentity] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidZipCode, setIsValidZipCode] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(false);

  /* API ERRORS */
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isStep1Valid = firstName.trim().length >= 2 && lastName.trim().length >= 2 && isValidBirthDate && isValidDocument && isValidIdentity;
  const isStep2Valid = isValidPhone && isValidEmail && password.length >= 8;
  const isStep3Valid = state !== "" && city !== "" && isValidZipCode && isValidNumber && street.trim() !== "" && neighborhood.trim() !== "";

  const handleNextStep = () => {
    setStepError(null);
    if (step === 1 && !isStep1Valid) return setStepError("Preencha todos os dados pessoais.");
    if (step === 2 && !isStep2Valid) return setStepError("Verifique e-mail, telefone e senha.");
    
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStepError(null);
    setStep((prev) => prev - 1);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isStep3Valid) return;

    setIsLoading(true);
    setStepError(null);
    setEmailError(null);
    setPasswordError(null);

    const payload = {
      firstName, lastName, birthDate, document, identity, phone, email, password,
      address: { zipCode, street, number, neighborhood, city, state, complement: complement || null },
    };

    try {
      const res = await fetch("/api/auth/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        if (data.issues) {
          data.issues.forEach((issue: ApiError) => {
            if (issue.field === "email") setEmailError(issue.message);
            if (issue.field === "password") setPasswordError(issue.message);
          });
          setStepError("Dados inválidos.");
        } else {
          setStepError(data.error || "Erro no cadastro.");
        }
        return;
      }
      router.push("/client/register/success");
    } 
    
    catch (error) {
      console.error("Erro:", error);
      setIsLoading(false);
      setStepError("Erro de conexão.");
    };
  };

  return (
    <div className="column gap-5">
      <StepIndicator currentStep={step} />

      {stepError && (
        <div className="message error">
          {stepError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* STEP 1: PERSONAL DATA */}
        {step === 1 && (
          <div className="column gap-5">
            <div className="row gap-2">
              <div>
                <label>Nome</label>
                <input 
                  className="input" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}  
                />
              </div>
              <div>
                <label>Sobrenome</label>
                <input 
                  className="input" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
            <BirthDate 
              label="Nascimento" 
              value={birthDate} 
              onChange={setBirthDate} 
              onValidChange={setIsValidBirthDate} 
              isAdultOnly={true} 
            />
            
            <Document 
              label="CPF" 
              value={document} 
              onChange={setDocument} 
              onValidChange={setIsValidDocument} 
            />
            
            <Identity 
              label="RG" 
              value={identity} 
              onChange={setIdentity} 
              onValidChange={setIsValidIdentity} 
            />
          </div>
        )}

        {/* STEP 2: CONTACTS AND ACCESS */}
        {step === 2 && (
          <div className="column gap-5">
            <Phone 
              label="WhatsApp" 
              value={phone} 
              onChange={setPhone} 
              onValidChange={setIsValidPhone} 
            />
            
            <div>
              <Email 
                label="E-mail" 
                value={email} 
                onChange={(val) => { 
                  setEmail(val); 
                  setEmailError(null); 
                }} 
                onValidChange={setIsValidEmail} 
              />
              { emailError && 
                <span className="error-text">
                  {emailError}
                </span>
              }
            </div>

            <div>
              <PasswordRegister 
                value={password} 
                onChange={(val) => { 
                  setPassword(val); 
                  setPasswordError(null); 
                  }} 
                />
              { passwordError && 
                <span className="error-text">
                  {passwordError}
                </span>
              }
            </div>
          </div>
        )}

        {/* STEP 3: ADDRESS */}
        {step === 3 && (
          <div className="column gap-5">
            <div className="row gap-2">
              <div>
                <StateSelector 
                  value={state} 
                  onChange={setState} 
                />
              </div>
              
              <div>
                <CitySelector 
                  selectedState={state} 
                  value={city} 
                  onChange={setCity} 
                />
              </div>
            </div>

            <ZipCode 
              label="CEP" 
              value={zipCode} 
              onChange={setZipCode} 
              onValidChange={setIsValidZipCode} 
            />
            
            <div>
              <label>Rua/Avenida</label>
              <input 
                className="input" 
                value={street} 
                onChange={(e) => setStreet(e.target.value)}  
              />
            </div>

            <div className="row gap-2">
              <HouseNumber 
                label="Nº" 
                value={number} 
                onChange={setNumber} 
                onValidChange={setIsValidNumber} 
              />
              
              <div>
                <label>Bairro</label>
                <input 
                  className="input" 
                  value={neighborhood} 
                  onChange={(e) => setNeighborhood(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label>Complemento (Opcional)</label>
              <input 
                className="input" 
                value={complement} 
                onChange={(e) => setComplement(e.target.value)}  
              />
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="row gap-2">
          {step > 1 && 
            <button 
              type="button" 
              className="button clean flex-1" 
              onClick={handlePrevStep}
            >
              Voltar
            </button>}
          
          {step < 3 ? (
            <button 
              type="button" 
              className="button default flex-1" 
              onClick={handleNextStep} 
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}>
                Próximo
              </button>
          ) : (
            <button 
              type="submit" 
              className="button default flex-1" 
              disabled={!isStep3Valid || isLoading}
            >
              {isLoading ? "Processando..." : "Finalizar"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};