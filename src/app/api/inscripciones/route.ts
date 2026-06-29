// src/app/api/inscripciones/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  inscripcionesCursos,
  cursos,
  usuarios,
} from "@/lib/schema/index";
import { desc, eq, and, sql, SQL } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiAuth, requireApiRole } from "@/lib/auth";

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

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function normalizarId(valor: string | null | undefined) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    return null;
  }

  return numero;
}

function normalizarMonto(valor: unknown) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    return undefined;
  }

  return numero.toFixed(2);
}

function debeOcuparCupo(estado: string) {
  return estado.toLowerCase() !== "cancelado";
}

export async function GET(request: Request) {
  const { session, error } = await requireApiAuth();

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const cursoId = normalizarId(searchParams.get("cursoId"));
    const usuarioIdQuery = normalizarId(searchParams.get("usuarioId"));

    const esAdmin = session.user.rol === "admin";
    const usuarioSesionId = Number(session.user.id);

    if (!Number.isInteger(usuarioSesionId) || usuarioSesionId <= 0) {
      return NextResponse.json(
        { error: "Sesión inválida" },
        { status: 401 }
      );
    }

    const filtros: SQL[] = [];

    if (cursoId) {
      filtros.push(eq(inscripcionesCursos.cursoId, cursoId));
    }

    if (esAdmin) {
      if (usuarioIdQuery) {
        filtros.push(eq(inscripcionesCursos.usuarioId, usuarioIdQuery));
      }
    } else {
      if (usuarioIdQuery && usuarioIdQuery !== usuarioSesionId) {
        return NextResponse.json(
          { error: "No tienes permisos para consultar estas inscripciones" },
          { status: 403 }
        );
      }

      filtros.push(eq(inscripcionesCursos.usuarioId, usuarioSesionId));
    }

    const data = await db
      .select({
        idInscripcion: inscripcionesCursos.idInscripcion,
        cursoId: inscripcionesCursos.cursoId,
        usuarioId: inscripcionesCursos.usuarioId,
        fechaInscripcion: inscripcionesCursos.fechaInscripcion,
        estado: inscripcionesCursos.estado,
        montoPagado: inscripcionesCursos.montoPagado,
        metodoPago: inscripcionesCursos.metodoPago,
        tituloCurso: cursos.tituloCurso,
        nombreUsuario: sql<string>`
          CONCAT(${usuarios.nombre}, ' ', ${usuarios.apellidoPaterno})
        `.as("nombreUsuario"),
      })
      .from(inscripcionesCursos)
      .leftJoin(cursos, eq(inscripcionesCursos.cursoId, cursos.idCurso))
      .leftJoin(usuarios, eq(inscripcionesCursos.usuarioId, usuarios.id))
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(inscripcionesCursos.fechaInscripcion));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET inscripciones:", error);

    return NextResponse.json(
      { error: "Error al obtener inscripciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const cursoId = Number(body.cursoId);
    const usuarioId = Number(body.usuarioId);
    const estado = normalizarTexto(body.estado) || "activo";
    const metodoPago = normalizarTexto(body.metodoPago) || null;
    const montoPagado = normalizarMonto(body.montoPagado);

    if (!Number.isInteger(cursoId) || cursoId <= 0) {
      return NextResponse.json(
        { error: "El curso es requerido" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return NextResponse.json(
        { error: "El usuario es requerido" },
        { status: 400 }
      );
    }

    if (estado.length > 30) {
      return NextResponse.json(
        { error: "Estado de inscripción inválido" },
        { status: 400 }
      );
    }

    if (montoPagado === undefined) {
      return NextResponse.json(
        { error: "Monto pagado inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const nueva = await withUserEmail(userEmail, async () => {
      return await db.transaction(async (tx) => {
        const usuarioExiste = await tx
          .select({
            id: usuarios.id,
          })
          .from(usuarios)
          .where(and(eq(usuarios.id, usuarioId), eq(usuarios.activo, true)))
          .limit(1);

        if (!usuarioExiste.length) {
          throw new Error("USUARIO_NO_EXISTE");
        }

        const cursoResult = await tx.execute(sql`
          SELECT
            id_curso,
            cupo_maximo,
            cupos_ocupados,
            activo
          FROM academia.cursos
          WHERE id_curso = ${cursoId}
          FOR UPDATE
        `);

        const cursoRows = obtenerFilas(cursoResult);
        const curso = cursoRows[0];

        if (!curso) {
          throw new Error("CURSO_NO_EXISTE");
        }

        if (curso.activo !== true) {
          throw new Error("CURSO_INACTIVO");
        }

        const cupoMaximo = Number(curso.cupo_maximo ?? 0);
        const cuposOcupados = Number(curso.cupos_ocupados ?? 0);

        if (debeOcuparCupo(estado) && cuposOcupados >= cupoMaximo) {
          throw new Error("SIN_CUPOS");
        }

        const inscripcionExistente = await tx
          .select({
            idInscripcion: inscripcionesCursos.idInscripcion,
          })
          .from(inscripcionesCursos)
          .where(
            and(
              eq(inscripcionesCursos.cursoId, cursoId),
              eq(inscripcionesCursos.usuarioId, usuarioId)
            )
          )
          .limit(1);

        if (inscripcionExistente.length > 0) {
          throw new Error("YA_INSCRITO");
        }

        const inscripcion = await tx
          .insert(inscripcionesCursos)
          .values({
            cursoId,
            usuarioId,
            estado,
            montoPagado,
            metodoPago,
          })
          .returning({
            idInscripcion: inscripcionesCursos.idInscripcion,
            cursoId: inscripcionesCursos.cursoId,
            usuarioId: inscripcionesCursos.usuarioId,
            fechaInscripcion: inscripcionesCursos.fechaInscripcion,
            estado: inscripcionesCursos.estado,
            montoPagado: inscripcionesCursos.montoPagado,
            metodoPago: inscripcionesCursos.metodoPago,
          });

        if (!inscripcion.length || !inscripcion[0]) {
          throw new Error("NO_CREADA");
        }

        if (debeOcuparCupo(estado)) {
          await tx
            .update(cursos)
            .set({
              cuposOcupados: sql`COALESCE(${cursos.cuposOcupados}, 0) + 1`,
            })
            .where(eq(cursos.idCurso, cursoId));
        }

        return inscripcion;
      });
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json(
        { error: "Error al crear inscripción" },
        { status: 500 }
      );
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST inscripción:", error);

    if (error instanceof Error) {
      const mensajes: Record<string, { error: string; status: number }> = {
        USUARIO_NO_EXISTE: {
          error: "Usuario no encontrado",
          status: 404,
        },
        CURSO_NO_EXISTE: {
          error: "Curso no encontrado",
          status: 404,
        },
        CURSO_INACTIVO: {
          error: "El curso no está activo",
          status: 400,
        },
        SIN_CUPOS: {
          error: "Curso sin cupos disponibles",
          status: 400,
        },
        YA_INSCRITO: {
          error: "Usuario ya inscrito en este curso",
          status: 400,
        },
        NO_CREADA: {
          error: "No se pudo crear la inscripción",
          status: 500,
        },
      };

      const respuesta = mensajes[error.message];

      if (respuesta) {
        return NextResponse.json(
          { error: respuesta.error },
          { status: respuesta.status }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al crear inscripción" },
      { status: 500 }
    );
  }
}