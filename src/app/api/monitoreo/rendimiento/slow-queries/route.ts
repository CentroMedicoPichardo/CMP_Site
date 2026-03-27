// src/app/api/monitoreo/rendimiento/slow-queries/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql.raw(`
      SELECT 
        pid,
        usename as usuario,
        left(query, 200) as query,
        extract(epoch from (now() - query_start)) * 1000 as tiempo_ejecucion,
        query_start as fecha
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND state = 'active'
        AND pid != pg_backend_pid()
        AND extract(epoch from (now() - query_start)) > 1
        AND query NOT LIKE '%pg_stat_activity%'
      ORDER BY tiempo_ejecucion DESC
      LIMIT 10
    `));
    
    const rows = Array.isArray(result) ? result : [];
    
    const queries = rows.map((row: any) => ({
      pid: row.pid,
      usuario: row.usuario || 'desconocido',
      query: row.query || 'Sin consulta',
      tiempo_ejecucion: Math.round(row.tiempo_ejecucion || 0),
      fecha: row.fecha?.toISOString() || new Date().toISOString(),
      plan: 'EXPLAIN ANALYZE pendiente'
    }));
    
    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error obteniendo consultas lentas:', error);
    return NextResponse.json([], { status: 200 });
  }
}