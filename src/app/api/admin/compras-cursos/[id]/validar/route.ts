// src/app/api/admin/compras-cursos/[id]/validar/route.ts

import {
  and,
  eq,
  inArray,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import {
  compraParticipantes,
  comprasCursos,
  cursos,
  estadosCompra,
  historialEstadosCompra,
  inscripcionesCursos,
  metodosPagoCursos,
  movimientosCuposCurso,
  pagosCursos,
  participantes,
} from "@/lib/schema";
import type {
  ValidarCompraCursoAdminInput,
  ValidarCompraCursoAdminResponse,
} from "@/types/admin-compras-cursos";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const ESTADOS_COMPRA_VALIDABLES = [
  "Pago reportado",
  "En validación",
] as const;

const ESTADOS_PAGO_VALIDABLES = [
  "Reportado",
  "En revisión",
] as const;

const ESTADO_PAGO_VALIDADO =
  "Pago validado";

const ESTADO_INSCRIPCIONES_GENERADAS =
  "Inscripciones generadas";

const ESTADO_COMPRA_RECHAZADA =
  "Rechazada";

class ValidacionCompraError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ValidacionCompraError";
  }
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parsePositiveId(
  value: string
): number | null {
  const id = Number(value);

  return Number.isSafeInteger(id) &&
    id > 0
    ? id
    : null;
}

function parseInput(
  value: unknown
):
  | {
      success: true;
      data: ValidarCompraCursoAdminInput;
    }
  | {
      success: false;
      error: string;
    } {
  if (!isRecord(value)) {
    return {
      success: false,
      error:
        "El cuerpo de la solicitud no es válido",
    };
  }

  const accion = value.accion;

  if (
    accion !== "aprobar" &&
    accion !== "rechazar"
  ) {
    return {
      success: false,
      error:
        'La acción debe ser "aprobar" o "rechazar"',
    };
  }

  const observacionesRaw =
    value.observaciones;

  if (
    observacionesRaw !== null &&
    observacionesRaw !== undefined &&
    typeof observacionesRaw !== "string"
  ) {
    return {
      success: false,
      error:
        "Las observaciones no son válidas",
    };
  }

  const observaciones =
    typeof observacionesRaw === "string"
      ? observacionesRaw
          .trim()
          .slice(0, 2000) || null
      : null;

  if (
    accion === "rechazar" &&
    !observaciones
  ) {
    return {
      success: false,
      error:
        "Debes indicar el motivo del rechazo",
    };
  }

  return {
    success: true,
    data: {
      accion,
      observaciones,
    },
  };
}

function decimalToCents(
  value: string | number
): number {
  const normalized = String(value).trim();

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(
      normalized
    )
  ) {
    throw new ValidacionCompraError(
      "Se encontró un importe inválido",
      500
    );
  }

  const [integerPart, decimalPart = ""] =
    normalized.split(".");

  const cents =
    Number(integerPart) * 100 +
    Number(
      decimalPart.padEnd(2, "0")
    );

  if (!Number.isSafeInteger(cents)) {
    throw new ValidacionCompraError(
      "El importe excede el rango permitido",
      500
    );
  }

  return cents;
}

function centsToDecimal(
  cents: number
): string {
  return `${Math.floor(cents / 100)}.${String(
    cents % 100
  ).padStart(2, "0")}`;
}

function idToSafeNumber(
  value: bigint | number,
  fieldName: string
): number {
  const id =
    typeof value === "bigint"
      ? Number(value)
      : value;

  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    throw new ValidacionCompraError(
      `El campo ${fieldName} no contiene un ID válido`,
      500
    );
  }

  return id;
}

async function obtenerEstadoCompra(
  tx: Parameters<
    Parameters<typeof db.transaction>[0]
  >[0],
  nombre: string
) {
  const [estado] = await tx
    .select({
      idEstado:
        estadosCompra.idestadocompra,
      nombre:
        estadosCompra.nombre,
    })
    .from(estadosCompra)
    .where(
      and(
        eq(
          estadosCompra.nombre,
          nombre
        ),
        eq(
          estadosCompra.activo,
          true
        )
      )
    )
    .limit(1);

  if (!estado) {
    throw new ValidacionCompraError(
      `No existe el estado de compra "${nombre}"`,
      500
    );
  }

  return estado;
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  const adminId = Number(
    session.user.id
  );

  if (
    !Number.isSafeInteger(adminId) ||
    adminId <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "La sesión administrativa no contiene un usuario válido",
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const compraId = parsePositiveId(id);

  if (!compraId) {
    return NextResponse.json(
      {
        error:
          "El identificador de la compra no es válido",
      },
      { status: 400 }
    );
  }

  const body: unknown =
    await request.json();

  const parsed = parseInput(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error,
      },
      { status: 400 }
    );
  }

  try {
    const resultado =
      await withUserEmail(
        session.user.correo,
        async () =>
          db.transaction(
            async (tx) => {
              await tx.execute(sql`
                SELECT idcompra
                FROM academia.comprascursosinacademia
                WHERE idcompra = ${compraId}
                FOR UPDATE
              `);

              const [compra] = await tx
                .select({
                  idCompra:
                    comprasCursos.idcompra,
                  cursoId:
                    comprasCursos.idcurso,
                  usuarioId:
                    comprasCursos.idusuario,
                  cantidadCupos:
                    comprasCursos.cantidadcupos,
                  precioUnitario:
                    comprasCursos.preciounitario,
                  total:
                    comprasCursos.total,
                  estadoId:
                    comprasCursos.idestadocompra,
                  estado:
                    estadosCompra.nombre,
                })
                .from(comprasCursos)
                .innerJoin(
                  estadosCompra,
                  eq(
                    comprasCursos.idestadocompra,
                    estadosCompra.idestadocompra
                  )
                )
                .where(
                  eq(
                    comprasCursos.idcompra,
                    BigInt(compraId)
                  )
                )
                .limit(1);

              if (!compra) {
                throw new ValidacionCompraError(
                  "Compra no encontrada",
                  404
                );
              }

              if (
                !ESTADOS_COMPRA_VALIDABLES.some(
                  (estado) =>
                    estado === compra.estado
                )
              ) {
                throw new ValidacionCompraError(
                  `La compra no puede validarse cuando está en estado "${compra.estado}"`,
                  409
                );
              }

              if (
                parsed.data.accion ===
                "rechazar"
              ) {
                const estadoRechazada =
                  await obtenerEstadoCompra(
                    tx,
                    ESTADO_COMPRA_RECHAZADA
                  );

                await tx
                  .update(pagosCursos)
                  .set({
                    estado: "Rechazado",
                    usuarioValida:
                      adminId,
                    fechaValidacion:
                      sql`CURRENT_TIMESTAMP`,
                    motivoRechazo:
                      parsed.data
                        .observaciones,
                  })
                  .where(
                    and(
                      eq(
                        pagosCursos.idCompra,
                        compraId
                      ),
                      inArray(
                        pagosCursos.estado,
                        [
                          ...ESTADOS_PAGO_VALIDABLES,
                        ]
                      )
                    )
                  );

                await tx
                  .update(comprasCursos)
                  .set({
                    idestadocompra:
                      estadoRechazada.idEstado,
                    fechavalidacion:
                      sql`CURRENT_TIMESTAMP`,
                    usuariovalida:
                      adminId,
                    observaciones:
                      parsed.data
                        .observaciones,
                  })
                  .where(
                    eq(
                      comprasCursos.idcompra,
                      BigInt(compraId)
                    )
                  );

                await tx
                  .insert(
                    historialEstadosCompra
                  )
                  .values({
                    idCompra: compraId,
                    idEstadoAnterior:
                      compra.estadoId,
                    idEstadoNuevo:
                      estadoRechazada.idEstado,
                    usuarioResponsable:
                      adminId,
                    origenCambio:
                      "Administrador",
                    motivo:
                      "Compra rechazada",
                    observaciones:
                      parsed.data
                        .observaciones,
                  });

                const response:
                  ValidarCompraCursoAdminResponse =
                  {
                    message:
                      "La compra fue rechazada correctamente",
                    compra: {
                      idCompra:
                        compraId,
                      estado:
                        estadoRechazada.nombre,
                    },
                    inscripcionesGeneradas:
                      0,
                  };

                return response;
              }

              await tx.execute(sql`
                SELECT id_curso
                FROM academia.cursos
                WHERE id_curso = ${compra.cursoId}
                FOR UPDATE
              `);

              const [curso] = await tx
                .select({
                  idCurso:
                    cursos.idCurso,
                  cupoMaximo:
                    cursos.cupoMaximo,
                  cuposOcupados:
                    cursos.cuposOcupados,
                })
                .from(cursos)
                .where(
                  eq(
                    cursos.idCurso,
                    compra.cursoId
                  )
                )
                .limit(1);

              if (!curso) {
                throw new ValidacionCompraError(
                  "Curso no encontrado",
                  404
                );
              }

              const cuposAntes =
                curso.cuposOcupados ?? 0;

              const cuposDespues =
                cuposAntes +
                compra.cantidadCupos;

              if (
                cuposDespues >
                curso.cupoMaximo
              ) {
                throw new ValidacionCompraError(
                  "No hay cupos suficientes para aprobar la compra",
                  409
                );
              }

              const pagos = await tx
                .select({
                  idPago:
                    pagosCursos.idPago,
                  monto:
                    pagosCursos.monto,
                  estado:
                    pagosCursos.estado,
                  metodoPago:
                    metodosPagoCursos.nombre,
                })
                .from(pagosCursos)
                .innerJoin(
                  metodosPagoCursos,
                  eq(
                    pagosCursos.idMetodoPago,
                    metodosPagoCursos.idMetodoPago
                  )
                )
                .where(
                  and(
                    eq(
                      pagosCursos.idCompra,
                      compraId
                    ),
                    inArray(
                      pagosCursos.estado,
                      [
                        ...ESTADOS_PAGO_VALIDABLES,
                        "Aprobado",
                      ]
                    )
                  )
                );

              if (pagos.length === 0) {
                throw new ValidacionCompraError(
                  "La compra no tiene pagos reportados",
                  409
                );
              }

              const totalCompraCents =
                decimalToCents(
                  compra.total
                );

              const totalPagosCents =
                pagos.reduce(
                  (total, pago) =>
                    total +
                    decimalToCents(
                      pago.monto
                    ),
                  0
                );

              if (
                totalPagosCents !==
                totalCompraCents
              ) {
                throw new ValidacionCompraError(
                  `El total reportado (${centsToDecimal(
                    totalPagosCents
                  )}) no coincide con el total de la compra (${centsToDecimal(
                    totalCompraCents
                  )})`,
                  409
                );
              }

              const relacionesParticipantes =
                await tx
                  .select({
                    idCompraParticipante:
                      compraParticipantes.idCompraParticipante,
                    participanteId:
                      compraParticipantes.idParticipante,
                    participanteUsuarioId:
                      participantes.usuarioId,
                  })
                  .from(
                    compraParticipantes
                  )
                  .innerJoin(
                    participantes,
                    eq(
                      compraParticipantes.idParticipante,
                      participantes.idParticipante
                    )
                  )
                  .where(
                    eq(
                      compraParticipantes.idCompra,
                      compraId
                    )
                  );

              if (
                relacionesParticipantes.length !==
                compra.cantidadCupos
              ) {
                throw new ValidacionCompraError(
                  "La cantidad de participantes no coincide con los cupos comprados",
                  409
                );
              }

              const idsCompraParticipante =
                relacionesParticipantes.map(
                  (item) =>
                    idToSafeNumber(
                      item.idCompraParticipante,
                      "idCompraParticipante"
                    )
                );

              const inscripcionesExistentes =
                await tx
                  .select({
                    idInscripcion:
                      inscripcionesCursos.idInscripcion,
                  })
                  .from(
                    inscripcionesCursos
                  )
                  .where(
                    inArray(
                      inscripcionesCursos.compraParticipanteId,
                      idsCompraParticipante
                    )
                  );

              if (
                inscripcionesExistentes.length >
                0
              ) {
                throw new ValidacionCompraError(
                  "La compra ya tiene inscripciones generadas",
                  409
                );
              }

              await tx
                .update(pagosCursos)
                .set({
                  estado: "Aprobado",
                  usuarioValida:
                    adminId,
                  fechaValidacion:
                    sql`CURRENT_TIMESTAMP`,
                  motivoRechazo:
                    null,
                })
                .where(
                  and(
                    eq(
                      pagosCursos.idCompra,
                      compraId
                    ),
                    inArray(
                      pagosCursos.estado,
                      [
                        ...ESTADOS_PAGO_VALIDABLES,
                      ]
                    )
                  )
                );

              const estadoPagoValidado =
                await obtenerEstadoCompra(
                  tx,
                  ESTADO_PAGO_VALIDADO
                );

              const estadoInscripciones =
                await obtenerEstadoCompra(
                  tx,
                  ESTADO_INSCRIPCIONES_GENERADAS
                );

              await tx
                .update(comprasCursos)
                .set({
                  idestadocompra:
                    estadoPagoValidado.idEstado,
                  fechavalidacion:
                    sql`CURRENT_TIMESTAMP`,
                  usuariovalida:
                    adminId,
                  observaciones:
                    parsed.data
                      .observaciones,
                })
                .where(
                  eq(
                    comprasCursos.idcompra,
                    BigInt(compraId)
                  )
                );

              await tx
                .insert(
                  historialEstadosCompra
                )
                .values({
                  idCompra: compraId,
                  idEstadoAnterior:
                    compra.estadoId,
                  idEstadoNuevo:
                    estadoPagoValidado.idEstado,
                  usuarioResponsable:
                    adminId,
                  origenCambio:
                    "Administrador",
                  motivo:
                    "Pago validado",
                  observaciones:
                    parsed.data
                      .observaciones,
                });

              const metodos = [
                ...new Set(
                  pagos.map(
                    (pago) =>
                      pago.metodoPago
                  )
                ),
              ];

              const metodoPagoInscripcion =
                metodos.length === 1
                  ? metodos[0] ??
                    "Pago validado"
                  : "Pago múltiple";

              const montoUnitario =
                compra.precioUnitario;

              const inscripciones =
                await tx
                  .insert(
                    inscripcionesCursos
                  )
                  .values(
                    relacionesParticipantes.map(
                      (item) => ({
                        cursoId:
                          compra.cursoId,
                        usuarioId:
                          item.participanteUsuarioId ??
                          compra.usuarioId,
                        estado:
                          "activo",
                        montoPagado:
                          montoUnitario,
                        metodoPago:
                          metodoPagoInscripcion.slice(
                            0,
                            50
                          ),
                        participanteId:
                          idToSafeNumber(
                            item.participanteId,
                            "participanteId"
                          ),
                        compraParticipanteId:
                          idToSafeNumber(
                            item.idCompraParticipante,
                            "idCompraParticipante"
                          ),
                        origenInscripcion:
                          "Compra",
                        fechaConfirmacion:
                          sql`CURRENT_TIMESTAMP`,
                        observaciones:
                          parsed.data
                            .observaciones,
                      })
                    )
                  )
                  .returning({
                    idInscripcion:
                      inscripcionesCursos.idInscripcion,
                  });

              if (
                inscripciones.length !==
                compra.cantidadCupos
              ) {
                throw new ValidacionCompraError(
                  "No se generaron todas las inscripciones",
                  500
                );
              }

              await tx
                .update(
                  compraParticipantes
                )
                .set({
                  estado:
                    "Inscrito",
                  observaciones:
                    parsed.data
                      .observaciones,
                  updatedAt:
                    sql`CURRENT_TIMESTAMP`,
                })
                .where(
                  eq(
                    compraParticipantes.idCompra,
                    compraId
                  )
                );

              await tx
                .update(cursos)
                .set({
                  cuposOcupados:
                    cuposDespues,
                  updatedAt:
                    sql`CURRENT_TIMESTAMP`,
                })
                .where(
                  eq(
                    cursos.idCurso,
                    compra.cursoId
                  )
                );

              await tx
                .insert(
                  movimientosCuposCurso
                )
                .values({
                  cursoId:
                    compra.cursoId,
                  compraId:
                    compraId,
                  tipoMovimiento:
                    "Inscripción directa",
                  cantidad:
                    compra.cantidadCupos,
                  cuposAntes,
                  cuposDespues,
                  usuarioResponsable:
                    adminId,
                  motivo:
                    "Inscripciones generadas por aprobación de compra",
                });

              await tx
                .update(comprasCursos)
                .set({
                  idestadocompra:
                    estadoInscripciones.idEstado,
                  fechavalidacion:
                    sql`CURRENT_TIMESTAMP`,
                  usuariovalida:
                    adminId,
                })
                .where(
                  eq(
                    comprasCursos.idcompra,
                    BigInt(compraId)
                  )
                );

              await tx
                .insert(
                  historialEstadosCompra
                )
                .values({
                  idCompra: compraId,
                  idEstadoAnterior:
                    estadoPagoValidado.idEstado,
                  idEstadoNuevo:
                    estadoInscripciones.idEstado,
                  usuarioResponsable:
                    adminId,
                  origenCambio:
                    "Sistema",
                  motivo:
                    "Inscripciones generadas automáticamente",
                  observaciones:
                    parsed.data
                      .observaciones,
                });

              const response:
                ValidarCompraCursoAdminResponse =
                {
                  message:
                    "La compra fue aprobada y las inscripciones se generaron correctamente",
                  compra: {
                    idCompra:
                      compraId,
                    estado:
                      estadoInscripciones.nombre,
                  },
                  inscripcionesGeneradas:
                    inscripciones.length,
                };

              return response;
            }
          )
      );

    return NextResponse.json(
      resultado,
      { status: 200 }
    );
  } catch (errorValue: unknown) {
    console.error(
      "Error validando compra de curso:",
      errorValue
    );

    if (
      errorValue instanceof
      ValidacionCompraError
    ) {
      return NextResponse.json(
        {
          error:
            errorValue.message,
        },
        {
          status:
            errorValue.status,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error interno al validar la compra",
      },
      { status: 500 }
    );
  }
}