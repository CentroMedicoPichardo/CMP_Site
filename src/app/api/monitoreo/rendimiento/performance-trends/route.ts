// src/app/api/monitoreo/rendimiento/performance-trends/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Datos de las últimas 24 horas (cada hora)
    const result = await db.execute(sql.raw(`
      SELECT 
        DATE_TRUNC('hour', fecha_hora) as hora,
        AVG(tiempo_ejecucion_ms) as tiempo_promedio,
        COUNT(*) as total_consultas,
        COUNT(CASE WHEN tiempo_ejecucion_ms > 1000 THEN 1 END) as consultas_lentas
      FROM seguridad.monitoreo_rendimiento
      WHERE fecha_hora > NOW() - INTERVAL '24 hours'
      GROUP BY DATE_TRUNC('hour', fecha_hora)
      ORDER BY hora DESC
      LIMIT 24
    `));
    
    const rows = Array.isArray(result) ? result : [];
    
    const trends = rows.map((row: any) => ({
      hora: row.hora?.toISOString() || new Date().toISOString(),
      tiempo_promedio: Math.round(row.tiempo_promedio || 0),
      total_consultas: Number(row.total_consultas) || 0,
      consultas_lentas: Number(row.consultas_lentas) || 0
    }));
    
    return NextResponse.json(trends.reverse());
  } catch (error) {
    console.error('Error obteniendo tendencias:', error);
    return NextResponse.json([], { status: 200 });
  }
}