// src/app/api/monitoreo/auditoria/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auditoriaAccionesInSeguridad } from '@/lib/schema/index';
import { desc, sql, and, ilike, eq, gte, lte } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario = searchParams.get('usuario');
    const tabla = searchParams.get('tabla');
    const accion = searchParams.get('accion');
    const fechaInicio = searchParams.get('fecha_inicio');
    const fechaFin = searchParams.get('fecha_fin');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construir filtros
    const filters = [];
    if (usuario) filters.push(ilike(auditoriaAccionesInSeguridad.usuario, `%${usuario}%`));
    if (tabla) filters.push(eq(auditoriaAccionesInSeguridad.tablaAfectada, tabla));
    if (accion) filters.push(eq(auditoriaAccionesInSeguridad.accion, accion));
    
    // Filtros de fecha usando SQL
    if (fechaInicio) {
      filters.push(gte(auditoriaAccionesInSeguridad.fechaHora, sql`${fechaInicio}::timestamp`));
    }
    if (fechaFin) {
      filters.push(lte(auditoriaAccionesInSeguridad.fechaHora, sql`${fechaFin}::timestamp`));
    }

    // Obtener registros
    const registros = await db.select()
      .from(auditoriaAccionesInSeguridad)
      .where(and(...filters))
      .orderBy(desc(auditoriaAccionesInSeguridad.fechaHora))
      .limit(limit)
      .offset(offset);

    // Obtener estadísticas
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(auditoriaAccionesInSeguridad)
      .where(and(...filters));

    const usuariosResult = await db.select({ count: sql<number>`count(distinct ${auditoriaAccionesInSeguridad.usuario})` })
      .from(auditoriaAccionesInSeguridad);

    const tablasResult = await db.select({ count: sql<number>`count(distinct ${auditoriaAccionesInSeguridad.tablaAfectada})` })
      .from(auditoriaAccionesInSeguridad);

    const hoyResult = await db.select({ count: sql<number>`count(*)` })
      .from(auditoriaAccionesInSeguridad)
      .where(sql`${auditoriaAccionesInSeguridad.fechaHora} >= CURRENT_DATE`);

    return NextResponse.json({
      registros: registros.map(r => ({
        id: r.idAuditoria,
        usuario: r.usuario,
        ip_address: r.ipAddress,
        accion: r.accion,
        tabla_afectada: r.tablaAfectada,
        registro_id: r.registroId,
        datos_anteriores: r.datosAnteriores,
        datos_nuevos: r.datosNuevos,
        fecha_hora: r.fechaHora,
        aplicacion_origen: r.aplicacionOrigen,
        session_id: r.sessionId
      })),
      stats: {
        total: totalResult[0]?.count || 0,
        usuariosDistintos: usuariosResult[0]?.count || 0,
        tablasAfectadas: tablasResult[0]?.count || 0,
        accionesHoy: hoyResult[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Error en auditoría:', error);
    return NextResponse.json(
      { error: 'Error al cargar auditoría' },
      { status: 500 }
    );
  }
}