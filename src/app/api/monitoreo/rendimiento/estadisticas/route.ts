// src/app/api/monitoreo/rendimiento/estadisticas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Contar consultas lentas de la última hora
    const slowQueries = await db.execute(sql.raw(`
      SELECT COUNT(*) as count
      FROM seguridad.monitoreo_rendimiento
      WHERE tiempo_ejecucion_ms > 1000
        AND fecha_hora > NOW() - INTERVAL '1 hour'
    `));
    
    // Contar índices no utilizados
    const unusedIndexes = await db.execute(sql.raw(`
      SELECT COUNT(*) as count
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0
    `));
    
    // Contar tablas con fragmentación > 10%
    const fragmentedTables = await db.execute(sql.raw(`
      SELECT COUNT(*) as count
      FROM pg_stat_user_tables
      WHERE n_dead_tup > n_live_tup * 0.1
    `));
    
    // Calcular cache hit ratio
    const cacheStats = await db.execute(sql.raw(`
      SELECT 
        COALESCE(SUM(heap_blks_hit), 0) as read_hit,
        COALESCE(SUM(heap_blks_read), 0) as read_miss
      FROM pg_statio_user_tables
    `));

    // Extraer valores de forma segura
    const slowCount = (Array.isArray(slowQueries) && slowQueries[0]?.count) 
      ? Number(slowQueries[0].count) 
      : 0;
    
    const unusedCount = (Array.isArray(unusedIndexes) && unusedIndexes[0]?.count) 
      ? Number(unusedIndexes[0].count) 
      : 0;
    
    const fragCount = (Array.isArray(fragmentedTables) && fragmentedTables[0]?.count) 
      ? Number(fragmentedTables[0].count) 
      : 0;
    
    const readHit = (Array.isArray(cacheStats) && cacheStats[0]?.read_hit) 
      ? Number(cacheStats[0].read_hit) 
      : 0;
    
    const readMiss = (Array.isArray(cacheStats) && cacheStats[0]?.read_miss) 
      ? Number(cacheStats[0].read_miss) 
      : 0;
    
    const total = readHit + readMiss;
    const hitRatio = total > 0 ? Math.round((readHit / total) * 100) : 0;

    return NextResponse.json({
      slowQueries: slowCount,
      unusedIndexes: unusedCount,
      fragmentedTables: fragCount,
      cacheHitRatio: hitRatio
    });
  } catch (error) {
    console.error('Error en estadísticas de rendimiento:', error);
    return NextResponse.json({
      slowQueries: 0,
      unusedIndexes: 0,
      fragmentedTables: 0,
      cacheHitRatio: 0
    });
  }
}