// src/app/api/dashboard-admin/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

type DbRow = Record<string, unknown>;

function obtenerFilas(resultado: unknown): DbRow[] {
  if (Array.isArray(resultado)) {
    return resultado as DbRow[];
  }

  if (
    resultado &&
    typeof resultado === "object" &&
    "rows" in resultado &&
    Array.isArray((resultado as { rows?: unknown }).rows)
  ) {
    return (resultado as { rows: DbRow[] }).rows;
  }

  return [];
}

function numero(valor: unknown) {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : 0;
}

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const totalUsuariosResult = await db.execute(sql`
      SELECT COUNT(*) AS total
      FROM seguridad.usuarios
      WHERE activo = true
    `);

    const usuariosNuevosMesResult = await db.execute(sql`
      SELECT COUNT(*) AS total
      FROM seguridad.usuarios
      WHERE activo = true
    `);

    const totalCursosResult = await db.execute(sql`
      SELECT COUNT(*) AS total
      FROM academia.cursos
    `);

    const cursosActivosResult = await db.execute(sql`
      SELECT COUNT(*) AS total
      FROM academia.cursos
      WHERE activo = true
    `);

    const totalInscripcionesResult = await db.execute(sql`
      SELECT COUNT(*) AS total
      FROM academia.inscripciones_cursos
      WHERE estado = 'activo'
    `);

    const ingresosTotalesResult = await db.execute(sql`
      SELECT COALESCE(SUM(monto_pagado::numeric), 0) AS total
      FROM academia.inscripciones_cursos
    `);

    const tasaOcupacionResult = await db.execute(sql`
      SELECT COALESCE(
        AVG(cupos_ocupados::float / NULLIF(cupo_maximo, 0) * 100),
        0
      ) AS promedio
      FROM academia.cursos
      WHERE activo = true
    `);

    const cursosRecientesResult = await db.execute(sql`
      SELECT
        c.id_curso AS "idCurso",
        c.titulo_curso AS "tituloCurso",
        c.cupos_ocupados AS "cuposOcupados",
        c.cupo_maximo AS "cupoMaximo",
        c.fecha_inicio AS "fechaInicio",
        c.activo AS "activo"
      FROM academia.cursos c
      ORDER BY c.id_curso DESC
      LIMIT 5
    `);

    const usuariosRecientesResult = await db.execute(sql`
      SELECT
        u.id AS "id",
        u.nombre AS "nombre",
        u."apellidoPaterno" AS "apellidoPaterno",
        u.correo AS "correo",
        COALESCE(r.nombre, 'cliente') AS "rol"
      FROM seguridad.usuarios u
      LEFT JOIN seguridad.roles r ON u.rol_id = r.id
      WHERE u.activo = true
      ORDER BY u.id DESC
      LIMIT 5
    `);

    const inscripcionesRecientesResult = await db.execute(sql`
      SELECT
        i.id_inscripcion AS "id",
        c.titulo_curso AS "curso",
        CONCAT(u.nombre, ' ', u."apellidoPaterno") AS "usuario",
        i.fecha_inscripcion AS "fecha",
        i.estado AS "estado"
      FROM academia.inscripciones_cursos i
      JOIN academia.cursos c ON i.curso_id = c.id_curso
      JOIN seguridad.usuarios u ON i.usuario_id = u.id
      ORDER BY i.id_inscripcion DESC
      LIMIT 5
    `);

    const totalUsuarios = obtenerFilas(totalUsuariosResult);
    const usuariosNuevosMes = obtenerFilas(usuariosNuevosMesResult);
    const totalCursos = obtenerFilas(totalCursosResult);
    const cursosActivos = obtenerFilas(cursosActivosResult);
    const totalInscripciones = obtenerFilas(totalInscripcionesResult);
    const ingresosTotales = obtenerFilas(ingresosTotalesResult);
    const tasaOcupacion = obtenerFilas(tasaOcupacionResult);
    const cursosRecientes = obtenerFilas(cursosRecientesResult);
    const usuariosRecientes = obtenerFilas(usuariosRecientesResult);
    const inscripcionesRecientes = obtenerFilas(inscripcionesRecientesResult);

    return NextResponse.json({
      stats: {
        totalUsuarios: numero(totalUsuarios[0]?.total),
        totalCursos: numero(totalCursos[0]?.total),
        totalInscripciones: numero(totalInscripciones[0]?.total),
        ingresosTotales: numero(ingresosTotales[0]?.total),
        cursosActivos: numero(cursosActivos[0]?.total),
        usuariosNuevosMes: numero(usuariosNuevosMes[0]?.total),
        tasaOcupacion: Math.round(numero(tasaOcupacion[0]?.promedio)),
      },
      cursosRecientes: cursosRecientes.map((curso) => ({
        idCurso: curso.idCurso,
        tituloCurso: curso.tituloCurso,
        cuposOcupados: numero(curso.cuposOcupados),
        cupoMaximo: numero(curso.cupoMaximo),
        fechaInicio: curso.fechaInicio,
        activo: Boolean(curso.activo),
      })),
      usuariosActivos: usuariosRecientes.map((usuario) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        correo: usuario.correo,
        rol: usuario.rol || "cliente",
      })),
      inscripcionesRecientes: inscripcionesRecientes.map((inscripcion) => ({
        id: inscripcion.id,
        curso: inscripcion.curso,
        usuario: inscripcion.usuario,
        fecha: inscripcion.fecha,
        estado: inscripcion.estado,
      })),
    });
  } catch (error) {
    console.error("Error en dashboard admin:", error);

    return NextResponse.json(
      { error: "Error al obtener estadísticas del dashboard" },
      { status: 500 }
    );
  }
}