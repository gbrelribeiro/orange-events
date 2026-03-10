/* lib/email/templates/verifyEmailTemplate.ts */

import { EMAIL_THEME } from "../constants";

type VerifyEmailTemplateProps = {
  verifyLink: string;
};

export function verifyEmailTemplate({ verifyLink }: VerifyEmailTemplateProps): string {
  const { colors, brand } = EMAIL_THEME;
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de E-mail - ${brand.name}</title>
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
                    text-align: center;"
                >
                  <h1 style="color: ${colors.white}; margin: 0; font-size: 32px; font-weight: bold;">${brand.name}</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <h1 style="color: ${colors.textMain}; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                    Confirme seu e-mail
                  </h1>
                  
                  <p style="color: ${colors.textBody}; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                    Olá,
                  </p>
                  
                  <p style="color: ${colors.textBody}; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                    Estamos felizes em ter você com a gente! 
                    Para concluir seu cadastro e garantir segurança na sua conta na <strong>${brand.name}</strong>, 
                    pedimos que confirme seu e-mail.
                  </p>
                  
                  <p style="color: ${colors.textBody}; font-size: 16px; line-height: 24px; margin: 0 0 30px;">
                    Clique no botão abaixo para confirmar:
                  </p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a 
                          href="${verifyLink}" 
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
                          Confirmar E-mail
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <div style="background-color: ${colors.info.bg}; border-left: 4px solid ${colors.info.border}; padding: 15px; margin: 20px 0;">
                    <p style="color: ${colors.info.text}; font-size: 14px; line-height: 20px; margin: 0;">
                      <strong>Dica:</strong> Esta confirmação ajuda a manter sua conta segura e garante que você receba nossas comunicações.
                    </p>
                  </div>
                  
                  <p style="color: ${colors.textMuted}; font-size: 14px; line-height: 20px; margin: 20px 0 0;">
                    Se você não criou uma conta na ${brand.name}, ignore este email.
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