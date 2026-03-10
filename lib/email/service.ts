/* lib/email/service.ts */

import { emailTransporter } from "./config";
import { forgotPasswordTemplate, passwordChangedTemplate, verifyEmailTemplate } from "./templates";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer | string; 
    contentType?: string;
  }[];
};

export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  try {
    const info = await emailTransporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Orange Trips"}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments
    });

    console.log("Email enviado com sucesso:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new Error("Falha ao enviar email");
  };
};

export async function sendPasswordResetEmail( 
  email: string, 
  userName: string, 
  resetToken: string, 
  baseUrl: string 
) {
  const resetLink = `${baseUrl}/client/password/forgot-password/reset?token=${resetToken}`;

  const html = forgotPasswordTemplate({
    userName,
    resetLink,
    expiresIn: "1 hora",
  });

  return sendEmail({
    to: email,
    subject: "Redefinir Senha - Orange Trips",
    html,
  });
};

export async function sendPasswordChangedEmail( email: string, userName: string ) {
  const html = passwordChangedTemplate({ userName });

  return sendEmail({
    to: email,
    subject: "Senha Alterada com Sucesso - Orange Trips",
    html,
  });
};

export async function sendVerifyEmail( email: string, token: string, baseUrl: string ) {
  const verifyLink = `${baseUrl}/client/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Confirme seu e-mail",
    html: verifyEmailTemplate({ verifyLink }),
  });
};