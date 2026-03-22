// src/lib/email.ts
import nodemailer from 'nodemailer';

// Configurar el transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error de configuración SMTP:', error.message);
    console.error('   Detalles:', error);
  } else {
    console.log('✅ Configuración SMTP correcta, listo para enviar correos');
  }
});

export async function sendVerificationEmail(email: string, nombre: string, codigo: string) {
  console.log(`📧 Intentando enviar email a: ${email}`);
  console.log(`📧 Usando cuenta: ${process.env.GMAIL_USER}`);
  
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; margin: 0; padding: 0;">
        <div style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 480px;">
          
          <div style="text-align: center; padding: 20px 0 10px;">
            <img src="https://res.cloudinary.com/tu-cloud/image/upload/v1/logo.png" alt="Centro Médico Pichardo" style="width: 80px; height: auto;" />
          </div>
          
          <h1 style="color: #0A3D62; font-size: 24px; font-weight: bold; text-align: center; padding: 10px;">
            Centro Médico Pichardo
          </h1>
          
          <p style="color: #444; font-size: 16px; line-height: 24px; text-align: left; padding: 0 40px;">
            Hola, <strong>${nombre}</strong>.
          </p>
          
          <p style="color: #444; font-size: 16px; line-height: 24px; text-align: left; padding: 0 40px;">
            Estás a un paso de crear tu cuenta. Usa el siguiente código para verificar tu correo electrónico:
          </p>
          
          <div style="background: #FFC300; border-radius: 4px; margin: 16px auto; width: 180px; text-align: center;">
            <h2 style="color: #0A3D62; font-size: 32px; font-weight: 700; letter-spacing: 4px; padding-top: 8px; padding-bottom: 8px; margin: 0;">
              ${codigo}
            </h2>
          </div>
          
          <p style="color: #444; font-size: 16px; line-height: 24px; text-align: left; padding: 0 40px;">
            Este código expirará en <strong>10 minutos</strong>. Si no solicitaste este registro, ignora este mensaje.
          </p>
          
          <hr style="border-color: #e6ebf1; margin: 20px 0;" />
          
          <p style="color: #8898aa; font-size: 12px; text-align: center;">
            Centro Médico Pichardo - Cuidando tu salud.
          </p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Centro Médico Pichardo" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verifica tu cuenta - Centro Médico Pichardo',
      html: htmlContent,
    };

    console.log("📧 Enviando correo con opciones:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${email}, ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error: any) {
    console.error('❌ Error detallado enviando email:', error);
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    console.error('   Respuesta:', error.response);
    return { success: false, error };
  }
}