// src/app/api/monitoreo/rendimiento/unused-indexes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql.raw(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size,
        idx_scan
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0
        AND schemaname IN ('clinica', 'seguridad', 'academia')
      ORDER BY pg_relation_size(indexname::regclass) DESC
      LIMIT 20
    `));
    
    const rows = Array.isArray(result) ? result : [];
    
    const indexes = rows.map((row: any) => ({
      schemaname: row.schemaname,
      tablename: row.tablename,
      indexname: row.indexname,
      index_size: row.index_size || '0 bytes',
      idx_scan: row.idx_scan || 0
    }));
    
    return NextResponse.json(indexes);
  } catch (error) {
    console.error('Error obteniendo índices no utilizados:', error);
    return NextResponse.json([], { status: 200 });
  }
}