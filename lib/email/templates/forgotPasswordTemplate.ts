/* lib/email/templates/forgotPasswordTemplate.ts */

import { EMAIL_THEME } from "../constants";

type EmailTemplateProps = {
  userName: string;
  resetLink: string;
  expiresIn?: string;
};

export function forgotPasswordTemplate({ 
  userName, 
  resetLink, 
  expiresIn = "1 hora" 
}: EmailTemplateProps): string {
  const { colors, brand } = EMAIL_THEME;
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinir Senha - ${brand.name}</title>
    </head>
    <body 
      style="margin: 0; 
      padding: 0; 
      font-family: Arial, sans-serif; 
      background-color: ${colors.bgLight};
    ">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.bgLight}; padding: 20px;">
        <tr>
          <td align="center">
            <table 
              width="600" 
              cellpadding="0" 
              cellspacing="0" 
              style="
                background-color: ${colors.white}; 
                border-radius: 8px; 
                overflow: hidden; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
              >
              
              <tr>
                <td 
                  style="
                    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%); 
                    padding: 40px 20px; 
                    text-align: center;
                  ">
                  <h1 style="color: ${colors.white}; margin: 0; font-size: 32px; font-weight: bold;">
                    ${brand.name}
                  </h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <h1 style="color: ${colors.textMain}; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                    Redefinir sua senha
                  </h1>
                  
                  <p style="color: ${colors.textBody}; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                    Olá <strong>${userName}</strong>,
                  </p>
                  
                  <p style="color: ${colors.textBody}; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                    Recebemos uma solicitação para redefinir a senha da sua conta na <strong>${brand.name}</strong>.
                  </p>
                  
                  <p style="color: ${colors.textBody}; font-size: 16px; line-height: 24px; margin: 0 0 30px;">
                    Clique no botão abaixo para criar uma nova senha:
                  </p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a 
                          href="${resetLink}" 
                          style="
                            display: inline-block; 
                            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%); 
                            color: ${colors.white}; 
                            padding: 16px 40px; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            font-size: 16px; 
                            font-weight: bold; 
                            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);"
                          >
                          Redefinir Senha
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <div 
                    style="
                      background-color: ${colors.warning.bg}; 
                      border-left: 4px solid ${colors.warning.border}; 
                      padding: 15px; 
                      margin: 20px 0;"
                  >
                    <p style="color: ${colors.warning.text}; font-size: 14px; line-height: 20px; margin: 0;">
                      <strong>Importante:</strong> Este link expira em ${expiresIn}. 
                      Por motivos de segurança, você precisará solicitar um novo link após esse período.
                    </p>
                  </div>
                  
                  <p style="color: ${colors.textMuted}; font-size: 14px; line-height: 20px; margin: 20px 0 0;">
                    Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá inalterada.
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid ${colors.border};">
                  <p style="color: ${colors.textMuted}; font-size: 13px; line-height: 20px; margin: 0 0 10px;">
                    © ${currentYear} ${brand.name}. Todos os direitos reservados.
                  </p>
                  <p style="color: ${colors.textMuted}; font-size: 12px; margin: 0;">
                    Este é um email automático, por favor não responda.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};