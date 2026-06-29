// src/app/api/inscripciones/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inscripcionesCursos, cursos } from "@/lib/schema/index";
import { eq, sql } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
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

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function validarId(id: string) {
  const idNum = Number(id);
  return Number.isInteger(idNum) && idNum > 0 ? idNum : null;
}

function normalizarMonto(valor: unknown) {
  if (valor === undefined) {
    return {
      actualizar: false,
      valor: null as string | null,
      invalido: false,
    };
  }

  if (valor === null || valor === "") {
    return {
      actualizar: true,
      valor: null as string | null,
      invalido: false,
    };
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    return {
      actualizar: true,
      valor: null as string | null,
      invalido: true,
    };
  }

  return {
    actualizar: true,
    valor: numero.toFixed(2),
    invalido: false,
  };
}

function debeOcuparCupo(estado: unknown) {
  const estadoNormalizado = String(estado ?? "").trim().toLowerCase();

  if (!estadoNormalizado) {
    return true;
  }

  return estadoNormalizado !== "cancelado";
}

async function obtenerInscripcionBloqueada(tx: any, idInscripcion: number) {
  const resultado = await tx.execute(sql`
    SELECT
      id_inscripcion,
      curso_id,
      usuario_id,
      estado,
      monto_pagado,
      metodo_pago
    FROM academia.inscripciones_cursos
    WHERE id_inscripcion = ${idInscripcion}
    FOR UPDATE
  `);

  return obtenerFilas(resultado)[0] ?? null;
}

async function obtenerCursoBloqueado(tx: any, cursoId: number) {
  const resultado = await tx.execute(sql`
    SELECT
      id_curso,
      cupo_maximo,
      cupos_ocupados
    FROM academia.cursos
    WHERE id_curso = ${cursoId}
    FOR UPDATE
  `);

  return obtenerFilas(resultado)[0] ?? null;
}

function obtenerRespuestaError(error: unknown) {
  if (!(error instanceof Error)) {
    return null;
  }

  const errores: Record<string, { error: string; status: number }> = {
    INSCRIPCION_NO_EXISTE: {
      error: "Inscripción no encontrada",
      status: 404,
    },
    ESTADO_INVALIDO: {
      error: "Estado de inscripción inválido",
      status: 400,
    },
    CURSO_INVALIDO: {
      error: "Curso inválido",
      status: 400,
    },
    CURSO_NO_EXISTE: {
      error: "Curso no encontrado",
      status: 404,
    },
    SIN_CUPOS: {
      error: "Curso sin cupos disponibles",
      status: 400,
    },
  };

  return errores[error.message] ?? null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idInscripcion = validarId(id);

    if (!idInscripcion) {
      return NextResponse.json(
        { error: "ID de inscripción inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const monto = normalizarMonto(body.montoPagado);

    if (monto.invalido) {
      return NextResponse.json(
        { error: "Monto pagado inválido" },
        { status: 400 }
      );
    }

    const metodoPagoRecibido = body.metodoPago !== undefined;

    let metodoPago: string | null | undefined = undefined;

    if (metodoPagoRecibido) {
      const metodoPagoTexto = normalizarTexto(body.metodoPago);
      metodoPago = metodoPagoTexto || null;
    }

    const userEmail = session.user.correo;

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db.transaction(async (tx) => {
        const inscripcion = await obtenerInscripcionBloqueada(
          tx,
          idInscripcion
        );

        if (!inscripcion) {
          throw new Error("INSCRIPCION_NO_EXISTE");
        }

        const estadoAnterior = String(inscripcion.estado ?? "activo");
        const estadoNuevo = normalizarTexto(body.estado) || estadoAnterior;

        if (estadoNuevo.length > 30) {
          throw new Error("ESTADO_INVALIDO");
        }

        const cursoId = Number(inscripcion.curso_id);

        if (!Number.isInteger(cursoId) || cursoId <= 0) {
          throw new Error("CURSO_INVALIDO");
        }

        const ocupabaCupoAntes = debeOcuparCupo(estadoAnterior);
        const ocupaCupoAhora = debeOcuparCupo(estadoNuevo);

        if (ocupabaCupoAntes !== ocupaCupoAhora) {
          const curso = await obtenerCursoBloqueado(tx, cursoId);

          if (!curso) {
            throw new Error("CURSO_NO_EXISTE");
          }

          const cupoMaximo = Number(curso.cupo_maximo ?? 0);
          const cuposOcupados = Number(curso.cupos_ocupados ?? 0);

          if (!ocupabaCupoAntes && ocupaCupoAhora) {
            if (cuposOcupados >= cupoMaximo) {
              throw new Error("SIN_CUPOS");
            }

            await tx
              .update(cursos)
              .set({
                cuposOcupados: sql`COALESCE(${cursos.cuposOcupados}, 0) + 1`,
              })
              .where(eq(cursos.idCurso, cursoId));
          }

          if (ocupabaCupoAntes && !ocupaCupoAhora) {
            await tx
              .update(cursos)
              .set({
                cuposOcupados: sql`GREATEST(COALESCE(${cursos.cuposOcupados}, 0) - 1, 0)`,
              })
              .where(eq(cursos.idCurso, cursoId));
          }
        }

        const updateData: {
          estado: string;
          montoPagado?: string | null;
          metodoPago?: string | null;
        } = {
          estado: estadoNuevo,
        };

        if (monto.actualizar) {
          updateData.montoPagado = monto.valor;
        }

        if (metodoPagoRecibido) {
          updateData.metodoPago = metodoPago ?? null;
        }

        return await tx
          .update(inscripcionesCursos)
          .set(updateData)
          .where(eq(inscripcionesCursos.idInscripcion, idInscripcion))
          .returning({
            idInscripcion: inscripcionesCursos.idInscripcion,
            cursoId: inscripcionesCursos.cursoId,
            usuarioId: inscripcionesCursos.usuarioId,
            fechaInscripcion: inscripcionesCursos.fechaInscripcion,
            estado: inscripcionesCursos.estado,
            montoPagado: inscripcionesCursos.montoPagado,
            metodoPago: inscripcionesCursos.metodoPago,
          });
      });
    });

    if (!actualizada.length || !actualizada[0]) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizada[0]);
  } catch (error) {
    console.error("Error en PUT inscripción:", error);

    const respuesta = obtenerRespuestaError(error);

    if (respuesta) {
      return NextResponse.json(
        { error: respuesta.error },
        { status: respuesta.status }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar inscripción" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idInscripcion = validarId(id);

    if (!idInscripcion) {
      return NextResponse.json(
        { error: "ID de inscripción inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const eliminada = await withUserEmail(userEmail, async () => {
      return await db.transaction(async (tx) => {
        const inscripcion = await obtenerInscripcionBloqueada(
          tx,
          idInscripcion
        );

        if (!inscripcion) {
          throw new Error("INSCRIPCION_NO_EXISTE");
        }

        const cursoId = Number(inscripcion.curso_id);
        const ocupabaCupo = debeOcuparCupo(inscripcion.estado);

        const resultado = await tx
          .delete(inscripcionesCursos)
          .where(eq(inscripcionesCursos.idInscripcion, idInscripcion))
          .returning({
            idInscripcion: inscripcionesCursos.idInscripcion,
            cursoId: inscripcionesCursos.cursoId,
            usuarioId: inscripcionesCursos.usuarioId,
            estado: inscripcionesCursos.estado,
          });

        if (ocupabaCupo && Number.isInteger(cursoId) && cursoId > 0) {
          await obtenerCursoBloqueado(tx, cursoId);

          await tx
            .update(cursos)
            .set({
              cuposOcupados: sql`GREATEST(COALESCE(${cursos.cuposOcupados}, 0) - 1, 0)`,
            })
            .where(eq(cursos.idCurso, cursoId));
        }

        return resultado;
      });
    });

    if (!eliminada.length || !eliminada[0]) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Inscripción eliminada correctamente",
      inscripcion: eliminada[0],
    });
  } catch (error) {
    console.error("Error en DELETE inscripción:", error);

    const respuesta = obtenerRespuestaError(error);

    if (respuesta) {
      return NextResponse.json(
        { error: respuesta.error },
        { status: respuesta.status }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar inscripción" },
      { status: 500 }
    );
  }
}