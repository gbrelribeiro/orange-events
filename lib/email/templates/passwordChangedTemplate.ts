/* lib/email/templates/passwordChangedTemplate.ts */

import { EMAIL_THEME } from "../constants";

type PasswordChangedTemplateProps = {
  userName: string;
};

export function passwordChangedTemplate({ userName }: PasswordChangedTemplateProps): string {
  const { colors, brand } = EMAIL_THEME;
  const currentYear = new Date().getFullYear();
  const formattedDate = new Date().toLocaleString('pt-BR', { 
    dateStyle: 'short', 
    timeStyle: 'short' 
  });

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Senha Alterada - ${brand.name}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: ${colors.bgLight};">
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
                  background: linear-gradient(135deg, ${colors.success.bg} 0%, ${colors.success.border} 100%); 
                  padding: 40px 20px; 
                  text-align: center;"
                >
                  <h1 style="color: ${colors.white}; margin: 0; font-size: 28px;">Senha Alterada com Sucesso</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: ${colors.textMain}; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                    Olá <strong>${userName}</strong>,
                  </p>
                  
                  <p style="color: ${colors.textMain}; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                    Confirmamos que a senha da sua conta na <strong>${brand.name}</strong> 
                    foi alterada com sucesso em <strong>${formattedDate}</strong>.
                  </p>
                  
                  <div style="background-color: ${colors.info.bg}; border-left: 4px solid ${colors.info.border}; padding: 15px; margin: 20px 0;">
                    <p style="color: ${colors.info.text}; font-size: 14px; line-height: 20px; margin: 0;">
                      <strong>Dica de segurança:</strong> Use senhas únicas e fortes para cada serviço. Considere usar um gerenciador de senhas.
                    </p>
                  </div>
                  
                  <div style="background-color: ${colors.danger.bg}; border-left: 4px solid ${colors.danger.border}; padding: 15px; margin: 20px 0;">
                    <p style="color: ${colors.danger.text}; font-size: 14px; line-height: 20px; margin: 0 0 10px;">
                      <strong>Você não fez esta alteração?</strong>
                    </p>
                    <p style="color: ${colors.danger.text}; font-size: 14px; line-height: 20px; margin: 0;">
                      Se você não alterou sua senha, sua conta pode estar comprometida. Entre em contato com nosso suporte imediatamente através do e-mail: ${brand.supportEmail}.
                    </p>
                  </div>
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