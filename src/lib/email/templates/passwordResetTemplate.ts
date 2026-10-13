export function buildPasswordResetEmail(params: {
  resetUrl: string;
  expirationMinutes: number;
}) {
  const {resetUrl, expirationMinutes} = params;

  const subject =
    'Recuperación de contraseña - Centro Médico Pichardo';

  const text = [
    'Recibimos una solicitud para restablecer tu contraseña.',
    '',
    `Usa este enlace para establecer una nueva contraseña: ${resetUrl}`,
    '',
    `Este enlace es válido durante ${expirationMinutes} minutos y solo puede utilizarse una vez.`,
    '',
    'Si no solicitaste este cambio, ignora este correo.',
    '',
    'Centro Médico Pichardo',
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperación de contraseña</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
    <div style="width:100%; background-color:#f4f7fb; padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
        <tr>
          <td style="background-color:#0b4f7a; padding:24px 32px; text-align:center;">
            <h1 style="margin:0; font-size:28px; line-height:1.2; color:#ffffff; font-weight:700;">
              Centro Médico Pichardo
            </h1>
            <p style="margin:8px 0 0 0; font-size:14px; color:#dbeafe;">
              Recuperación segura de contraseña
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 16px 0; font-size:30px; line-height:1.2; color:#0b4f7a; font-weight:700;">
              Recupera tu contraseña
            </h2>

            <p style="margin:0 0 16px 0; font-size:16px; line-height:1.7; color:#374151;">
              Recibimos una solicitud para restablecer tu contraseña.
            </p>

            <p style="margin:0 0 24px 0; font-size:16px; line-height:1.7; color:#374151;">
              Para continuar, presiona el siguiente botón:
            </p>

            <div style="text-align:center; margin:32px 0;">
              <a
                href="${resetUrl}"
                style="display:inline-block; background-color:#0b4f7a; color:#ffffff; text-decoration:none; font-size:16px; font-weight:700; padding:14px 28px; border-radius:10px;"
              >
                Establecer nueva contraseña
              </a>
            </div>

            <p style="margin:0 0 16px 0; font-size:15px; line-height:1.7; color:#374151;">
              Este enlace es válido durante
              <strong>${expirationMinutes} minutos</strong>
              y solo puede utilizarse una vez.
            </p>

            <p style="margin:0 0 24px 0; font-size:15px; line-height:1.7; color:#374151;">
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
            </p>

            <p style="margin:0 0 24px 0; font-size:14px; line-height:1.7; word-break:break-word;">
              <a href="${resetUrl}" style="color:#0b4f7a; text-decoration:underline;">
                ${resetUrl}
              </a>
            </p>

            <div style="background-color:#fff7e6; border:1px solid #f4d38a; border-radius:12px; padding:16px; margin-top:24px;">
              <p style="margin:0; font-size:14px; line-height:1.6; color:#7c5a10;">
                Si no solicitaste este cambio, puedes ignorar este correo con tranquilidad.
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
            <p style="margin:0 0 8px 0; font-size:14px; font-weight:700; color:#0b4f7a;">
              Centro Médico Pichardo
            </p>
            <p style="margin:0; font-size:12px; line-height:1.6; color:#6b7280;">
              Este es un mensaje automático. Por favor, no respondas a este correo.
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

  return {
    subject,
    text,
    html,
  };
}