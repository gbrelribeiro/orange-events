/* components/forms/AdminLoginForm.tsx */

"use client";

import { SyntheticEvent, useState } from "react";
import ForgotPassword from "@/components/buttons/ForgotPassword";
import { ApiError } from "@/types/error";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* INLINE ERRORS CONSTANTS */
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  /* LOG IN SUBMIT FUNCTION */
  async function adminHandleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    /* ERROR VALIDATION WHEN USER TYPE WRONG EMAIL OR WRONG PASSWORD */
    if (!res.ok) {
      setEmailError(null);
      setPasswordError(null);

      if (data.issues?.length) {
        const issues: ApiError[] = data.issues;

        issues.forEach((issue) => {
          if (issue.field === "email")
            setEmailError(issue.message);

          if (issue.field === "password")
            setPasswordError(issue.message);
        });

        return;
      }

      if (data.error === "Email not found.") {
        setEmailError(data.error);
        return;
      }

      if (data.error === "Incorrect password.") {
        setPasswordError(data.error);
        return;
      }

      setPasswordError("Invalid log in.");
      return;
    }

    window.location.href = "/admin";
  };
  
  return (
    <form className="column gap-5" onSubmit={adminHandleSubmit}>
      {/* EMAIL INPUT */}
      <div>
        <label htmlFor="Email">
          Email
        </label>
        
        <input 
          type="email" 
          className={`input ${emailError ? "error-input" : ""}`}
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null) }}
        />

        {/* EMAIL ERROR EXIBITION */}
          {emailError && (
            <span className="error-text">
              {emailError}
            </span>
          )}
      </div>

      {/* PASSWORD INPUT */}
      <div>
        <label htmlFor="Password">
          Senha
        </label>
        
        <input 
          type="password"
          className={`input ${passwordError ? "error-input" : ""}`}
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null) }}
        />

        {/* PASSWORD ERROR EXIBITION */}
        {passwordError && (
          <span className="error-text">
            {passwordError}
          </span>
        )}

        {/* FORGOT PASSWORD BUTTON */}
        <ForgotPassword/>
      </div>

      {/* ADMIN LOG IN SUBMIT BUTTON */}
      <button type="submit" className="button default">
        Log In
      </button>
    </form>
  );
};