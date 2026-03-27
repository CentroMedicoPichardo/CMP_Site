// src/app/api/monitoreo/rendimiento/fragmentation/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql.raw(`
      SELECT 
        schemaname,
        tablename,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples,
        CASE 
          WHEN n_live_tup > 0 THEN (n_dead_tup::float / n_live_tup) * 100
          ELSE 0
        END as dead_ratio,
        last_vacuum,
        last_autovacuum
      FROM pg_stat_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
        AND n_dead_tup > 0
      ORDER BY dead_ratio DESC
      LIMIT 20
    `));
    
    const rows = Array.isArray(result) ? result : [];
    
    const tables = rows.map((row: any) => ({
      schemaname: row.schemaname,
      tablename: row.tablename,
      live_tuples: row.live_tuples || 0,
      dead_tuples: row.dead_tuples || 0,
      dead_ratio: Number(row.dead_ratio) || 0,
      last_vacuum: row.last_vacuum ? new Date(row.last_vacuum).toLocaleDateString() : 'Nunca',
      last_autovacuum: row.last_autovacuum ? new Date(row.last_autovacuum).toLocaleDateString() : 'Nunca'
    }));
    
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error obteniendo fragmentación:', error);
    return NextResponse.json([], { status: 200 });
  }
}