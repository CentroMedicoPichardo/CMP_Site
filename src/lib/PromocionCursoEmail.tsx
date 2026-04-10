// src/lib/PromocionCursoEmail.tsx
export const PromocionCursoEmail = ({ 
  titulo, 
  lugaresDisponibles, 
  costo 
}: { 
  titulo: string; 
  lugaresDisponibles: number;
  costo: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: linear-gradient(135deg, #0A3D62, #1A4F7A); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; }
    .button { background: #FFC300; color: #0A3D62; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; }
    .alert { background: #fef3c7; border-left: 4px solid #FFC300; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 ${titulo}</h1>
      <p>¡Una oportunidad que no querrás perderte!</p>
    </div>
    <div class="content">
      <div class="alert">
        <strong>⚠️ ¡Últimos lugares disponibles!</strong><br>
        Solo quedan <strong>${lugaresDisponibles}</strong> lugares para este curso.
      </div>
      
      <p>📅 Inicio: Próximamente<br>
      💰 Costo: $${costo}<br>
      📍 Modalidad: Presencial/Online</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/cursos" class="button">
          🔗 Ver curso y apartar lugar
        </a>
      </div>
      
      <p>¡Asegura tu lugar hoy mismo! Cupo limitado.</p>
    </div>
    <div class="footer">
      <p>Centro Médico Pichardo - Formación para Padres</p>
      <p>Si no deseas recibir estos correos, <a href="#">da clic aquí</a></p>
    </div>
  </div>
</body>
</html>
`;