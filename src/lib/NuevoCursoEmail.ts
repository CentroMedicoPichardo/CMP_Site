// src/lib/NuevoCursoEmail.ts

export const NuevoCursoEmail = ({
  titulo,
  costo
}: {
  titulo: string;
  costo: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: linear-gradient(135deg, #0A3D62, #1A4F7A); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; }
    .badge { background: #22c55e; color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; display: inline-block; }
    .button { background: #FFC300; color: #0A3D62; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">✨ NUEVO</span>
      <h1>🎓 ${titulo}</h1>
      <p>¡Nuevo curso disponible!</p>
    </div>

    <div class="content">
      <p>Hemos abierto un nuevo curso que puede interesarte 👇</p>

      <p>
        💰 Costo: <strong>$${costo}</strong><br>
        📅 Inicio: Próximamente<br>
        📍 Modalidad: Presencial/Online
      </p>

      <div style="text-align:center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/cursos" class="button">
          Ver curso
        </a>
      </div>

      <p>¡Inscríbete antes de que se llene!</p>
    </div>

    <div class="footer">
      <p>Centro Médico Pichardo</p>
    </div>
  </div>
</body>
</html>
`;