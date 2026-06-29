// src/app/api/monitoreo/auditoria/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditoriaAccionesInSeguridad } from "@/lib/schema/index";
import { desc, sql, and, ilike, eq, gte, lte, SQL } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: string | null, maxLength = 100) {
  if (!valor) return null;

  const texto = valor.trim();

  if (!texto) return null;

  return texto.slice(0, maxLength);
}

function obtenerLimiteSeguro(valor: string | null) {
  const limite = Number(valor ?? 100);

  if (!Number.isInteger(limite) || limite <= 0) {
    return 100;
  }

  return Math.min(limite, 500);
}

function obtenerOffsetSeguro(valor: string | null) {
  const offset = Number(valor ?? 0);

  if (!Number.isInteger(offset) || offset < 0) {
    return 0;
  }

  return offset;
}

function fechaValida(valor: string | null) {
  if (!valor) return null;

  const fecha = valor.trim();

  if (!fecha) return null;

  const parsed = new Date(fecha);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return fecha;
}

function numero(valor: unknown) {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : 0;
}

export async function GET(request: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);

    const usuario = normalizarTexto(searchParams.get("usuario"));
    const tabla = normalizarTexto(searchParams.get("tabla"));
    const accion = normalizarTexto(searchParams.get("accion"));
    const fechaInicio = fechaValida(searchParams.get("fecha_inicio"));
    const fechaFin = fechaValida(searchParams.get("fecha_fin"));

    const limit = obtenerLimiteSeguro(searchParams.get("limit"));
    const offset = obtenerOffsetSeguro(searchParams.get("offset"));

    const filters: SQL[] = [];

    if (usuario) {
      filters.push(
        ilike(auditoriaAccionesInSeguridad.usuario, `%${usuario}%`)
      );
    }

    if (tabla) {
      filters.push(eq(auditoriaAccionesInSeguridad.tablaAfectada, tabla));
    }

    if (accion) {
      filters.push(eq(auditoriaAccionesInSeguridad.accion, accion));
    }

    if (fechaInicio) {
      filters.push(
        gte(
          auditoriaAccionesInSeguridad.fechaHora,
          sql`${fechaInicio}::timestamp`
        )
      );
    }

    if (fechaFin) {
      filters.push(
        lte(
          auditoriaAccionesInSeguridad.fechaHora,
          sql`${fechaFin}::timestamp`
        )
      );
    }

    const whereCondition = filters.length ? and(...filters) : undefined;

    const registros = await db
      .select({
        idAuditoria: auditoriaAccionesInSeguridad.idAuditoria,
        usuario: auditoriaAccionesInSeguridad.usuario,
        ipAddress: auditoriaAccionesInSeguridad.ipAddress,
        accion: auditoriaAccionesInSeguridad.accion,
        tablaAfectada: auditoriaAccionesInSeguridad.tablaAfectada,
        registroId: auditoriaAccionesInSeguridad.registroId,
        datosAnteriores: auditoriaAccionesInSeguridad.datosAnteriores,
        datosNuevos: auditoriaAccionesInSeguridad.datosNuevos,
        fechaHora: auditoriaAccionesInSeguridad.fechaHora,
        aplicacionOrigen: auditoriaAccionesInSeguridad.aplicacionOrigen,
        sessionId: auditoriaAccionesInSeguridad.sessionId,
      })
      .from(auditoriaAccionesInSeguridad)
      .where(whereCondition)
      .orderBy(desc(auditoriaAccionesInSeguridad.fechaHora))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(auditoriaAccionesInSeguridad)
      .where(whereCondition);

    const usuariosResult = await db
      .select({
        count: sql<number>`count(distinct ${auditoriaAccionesInSeguridad.usuario})::int`,
      })
      .from(auditoriaAccionesInSeguridad);

    const tablasResult = await db
      .select({
        count: sql<number>`count(distinct ${auditoriaAccionesInSeguridad.tablaAfectada})::int`,
      })
      .from(auditoriaAccionesInSeguridad);

    const hoyResult = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(auditoriaAccionesInSeguridad)
      .where(sql`${auditoriaAccionesInSeguridad.fechaHora} >= CURRENT_DATE`);

    return NextResponse.json(
      {
        registros: registros.map((registro) => ({
          id: registro.idAuditoria,
          usuario: registro.usuario,
          ip_address: registro.ipAddress,
          accion: registro.accion,
          tabla_afectada: registro.tablaAfectada,
          registro_id: registro.registroId,
          datos_anteriores: registro.datosAnteriores,
          datos_nuevos: registro.datosNuevos,
          fecha_hora: registro.fechaHora,
          aplicacion_origen: registro.aplicacionOrigen,
          session_id: registro.sessionId,
        })),
        stats: {
          total: numero(totalResult[0]?.count),
          usuariosDistintos: numero(usuariosResult[0]?.count),
          tablasAfectadas: numero(tablasResult[0]?.count),
          accionesHoy: numero(hoyResult[0]?.count),
        },
        pagination: {
          limit,
          offset,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en auditoría:", error);

    return NextResponse.json(
      { error: "Error al cargar auditoría" },
      { status: 500 }
    );
  }
}