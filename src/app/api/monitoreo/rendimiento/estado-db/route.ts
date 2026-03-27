// src/app/api/monitoreo/rendimiento/estado-db/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // ============================================
    // DATOS REALES (siempre disponibles)
    // ============================================
    
    // 1. Número de Tablas
    const tableCount = await db.execute(sql.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema IN ('clinica', 'seguridad', 'academia')
        AND table_type = 'BASE TABLE'
    `));
    
    // 2. Número de Índices
    const indexCount = await db.execute(sql.raw(`
      SELECT COUNT(*) as count
      FROM pg_indexes
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `));
    
    // 3. Tamaño de las Tablas (con sus registros reales)
    const tableSizes = await db.execute(sql.raw(`
      SELECT 
        schemaname,
        tablename,
        n_live_tup as rows,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as data_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
      FROM pg_stat_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `));
    
    // 4. Tamaño total de la base de datos (real)
    const dbSize = await db.execute(sql.raw(`
      SELECT pg_database_size(current_database()) as size
    `));
    
    // 5. Registros totales (suma de todas las tablas)
    const totalRecords = await db.execute(sql.raw(`
      SELECT SUM(n_live_tup) as total
      FROM pg_stat_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `));
    
    // Extraer valores de forma segura
    const tableCountValue = (Array.isArray(tableCount) && tableCount[0]?.count) ? Number(tableCount[0].count) : 0;
    const indexCountValue = (Array.isArray(indexCount) && indexCount[0]?.count) ? Number(indexCount[0].count) : 0;
    const dbSizeBytes = (Array.isArray(dbSize) && dbSize[0]?.size) ? Number(dbSize[0].size) : 0;
    const totalRecordsValue = (Array.isArray(totalRecords) && totalRecords[0]?.total) ? Number(totalRecords[0].total) : 0;
    
    // Procesar tablas
    const tablesData = Array.isArray(tableSizes) ? tableSizes.map((row: any) => ({
      table: row.tablename || 'desconocido',
      schema: row.schemaname || 'desconocido',
      rows: Number(row.rows) || 0,
      data_size: row.data_size || '0 bytes',
      index_size: row.index_size || '0 bytes',
      total_size: row.total_size || '0 bytes'
    })) : [];
    
    return NextResponse.json({
      databaseSize: formatBytes(dbSizeBytes),
      tableCount: tableCountValue,
      totalRecords: totalRecordsValue,
      indexCount: indexCountValue,
      tables: tablesData
    });
  } catch (error) {
    console.error('Error obteniendo estado de la BD:', error);
    return NextResponse.json({
      databaseSize: '0 MB',
      tableCount: 0,
      totalRecords: 0,
      indexCount: 0,
      tables: []
    });
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}