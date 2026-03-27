// src/app/api/test-audit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAudit, getClientIp, getCurrentUserEmail } from '@/lib/db-audit';

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const userEmail = await getCurrentUserEmail();
  
  console.log("🧪 TEST - Email:", userEmail);
  console.log("🧪 TEST - IP:", clientIp);
  
  // Hacer un cambio real para probar
  const result = await withAudit(userEmail, clientIp, async () => {
    return await db.execute(`
      UPDATE clinica.medicos 
      SET especialidad = 'Prueba API' 
      WHERE id_medico = 1
    `);
  });
  
  // Verificar el último registro
  const lastAudit = await db.execute(`
    SELECT usuario, ip_address, accion 
    FROM seguridad.auditoria_acciones 
    ORDER BY fecha_hora DESC 
    LIMIT 1
  `);
  
  return NextResponse.json({ 
    email: userEmail,
    ip: clientIp,
    lastAudit: lastAudit[0]
  });
}