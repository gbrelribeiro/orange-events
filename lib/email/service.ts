/* lib/email/service.ts */

import { Resend } from "resend";
import { emailTransporter } from "./config";
import { forgotPasswordTemplate, passwordChangedTemplate, verifyEmailTemplate } from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function sendVerifyEmailClient( email: string, token: string, baseUrl: string ) {
  const verifyLink = `${baseUrl}/client/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Confirme seu e-mail",
    html: verifyEmailTemplate({ verifyLink }),
  });
};

export async function sendVerifyEmailMaster(email: string, token: string, baseUrl: string) {
  const verifyLink = `${baseUrl}/master/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Orange Events <onboarding@resend.dev>', 
      to: email,
      subject: 'Confirme seu e-mail de Organizador',
      html: verifyEmailTemplate({ verifyLink }),
    });

    if (error) {
      console.error("Erro retornado pelo Resend:", error);
      return { success: false, error };
    }

    console.log("Email enviado via Resend:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Falha na conexão com Resend:", err);
    throw err;
  }
};

export async function sendMasterApprovalEmail(email: string, firstName: string) {
  return resend.emails.send({
    from: 'Orange Events <onboarding@resend.dev>',
    to: email,
    subject: 'Sua conta de Organizador foi aprovada!',
    html: `<h1>Olá ${firstName}!</h1><p>Sua conta foi revisada e aprovada. Agora você já pode criar eventos.</p>`
  });
};