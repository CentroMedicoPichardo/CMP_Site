// src/app/api/monitoreo/rendimiento/cache-stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const hitResult = await db.execute(sql.raw(`
      SELECT 
        SUM(heap_blks_hit) as read_hit,
        SUM(heap_blks_read) as read_miss
      FROM pg_statio_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `));
    
    const bufferResult = await db.execute(sql.raw(`
      SELECT 
        setting::int as buffers_total,
        pg_stat_bgwriter.buffers_alloc as buffers_used
      FROM pg_settings,
           pg_stat_bgwriter
      WHERE name = 'shared_buffers'
    `));
    
    const hitRow = Array.isArray(hitResult) && hitResult[0] ? hitResult[0] : { read_hit: 0, read_miss: 0 };
    const bufferRow = Array.isArray(bufferResult) && bufferResult[0] ? bufferResult[0] : { buffers_total: 0, buffers_used: 0 };
    
    const readHit = Number(hitRow.read_hit) || 0;
    const readMiss = Number(hitRow.read_miss) || 0;
    const total = readHit + readMiss;
    const hitRatio = total > 0 ? (readHit / total) * 100 : 0;
    
    return NextResponse.json({
      hit_ratio: Math.round(hitRatio),
      read_hit: readHit,
      read_miss: readMiss,
      buffers_used: bufferRow.buffers_used || 0,
      buffers_total: bufferRow.buffers_total || 0
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de caché:', error);
    return NextResponse.json({
      hit_ratio: 0,
      read_hit: 0,
      read_miss: 0,
      buffers_used: 0,
      buffers_total: 0
    }, { status: 200 });
  }
}