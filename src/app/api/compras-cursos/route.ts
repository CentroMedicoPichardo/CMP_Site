// src/app/api/compras-cursos/route.ts

import { NextResponse } from "next/server";
import {
  and,
  desc,
  eq,
  inArray,
  sql,
} from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import {
  expirarComprasVencidas,
} from "@/lib/compras-cursos/expirar-compras";
import {
  compraParticipantes,
  comprasCursos,
  cursos,
  estadosCompra,
  historialEstadosCompra,
  participantes,
} from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarCrearCompraCurso,
} from "@/lib/validators/compras-cursos";
import {
  SEXOS_PARTICIPANTE,
  type CompraCursoListaItem,
  type CrearCompraCursoInput,
  type CrearCompraCursoResponse,
  type ListarComprasCursosResponse,
  type ParticipanteCompraInput,
  type SexoParticipante,
} from "@/types/compras-cursos";

const ESTADO_PENDIENTE_PAGO =
  "Pendiente de pago";

const ESTADOS_CON_RESERVA = [
  "Pendiente de pago",
  "Pago reportado",
  "En validación",
  "Pago validado",
] as const;

const HORAS_RESERVA = 48;

interface ParticipanteCreado {
  idParticipante: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  fechaNacimiento: string | null;
  sexo: SexoParticipante | null;
  telefono: string | null;
  correo: string | null;
  activo: boolean;
}

class CompraCursoError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "CompraCursoError";
  }
}

function validationErrorResponse<T>(
  result: Extract<
    ValidationResult<T>,
    { success: false }
  >
) {
  return NextResponse.json(
    {
      error: result.error,
      details: result.fieldErrors,
    },
    { status: 400 }
  );
}

function idToSafeNumber(
  value: number | bigint,
  fieldName: string
): number {
  const converted = Number(value);

  if (
    !Number.isSafeInteger(converted) ||
    converted <= 0
  ) {
    throw new CompraCursoError(
      `El valor de ${fieldName} no es válido`,
      500
    );
  }

  return converted;
}

function decimalToCents(
  value: string | number | null
): number {
  if (value === null) {
    return 0;
  }

  const normalized =
    String(value).trim();

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(
      normalized
    )
  ) {
    throw new CompraCursoError(
      "El precio configurado para el curso no es válido",
      500
    );
  }

  const [integerPart, decimalPart = ""] =
    normalized.split(".");

  const centsText = decimalPart
    .padEnd(2, "0")
    .slice(0, 2);

  const cents =
    Number(integerPart) * 100 +
    Number(centsText);

  if (
    !Number.isSafeInteger(cents) ||
    cents < 0
  ) {
    throw new CompraCursoError(
      "El precio del curso excede el rango permitido",
      500
    );
  }

  return cents;
}

function centsToDecimal(
  cents: number
): string {
  const integerPart =
    Math.floor(cents / 100);

  const decimalPart = String(
    cents % 100
  ).padStart(2, "0");

  return `${integerPart}.${decimalPart}`;
}

function crearFechaLimitePago(): string {
  const fecha = new Date();

  fecha.setHours(
    fecha.getHours() + HORAS_RESERVA
  );

  return fecha.toISOString();
}

function isSexoParticipante(
  value: unknown
): value is SexoParticipante {
  return (
    typeof value === "string" &&
    SEXOS_PARTICIPANTE.some(
      (sexo) => sexo === value
    )
  );
}

function normalizarSexoParticipante(
  value: string | null
): SexoParticipante | null {
  if (value === null) {
    return null;
  }

  if (!isSexoParticipante(value)) {
    throw new CompraCursoError(
      "El sexo almacenado para un participante no es válido",
      500
    );
  }

  return value;
}

function esParticipanteExistente(
  participante: ParticipanteCompraInput
): participante is {
  participanteId: number;
} {
  return "participanteId" in participante;
}

function fechaToString(
  value: string | Date | null,
  fieldName: string
): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" &&
    value.length > 0
  ) {
    return value;
  }

  throw new CompraCursoError(
    `No fue posible obtener ${fieldName}`,
    500
  );
}

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  const usuarioId = Number(
    session.user.id
  );

  if (
    !Number.isSafeInteger(usuarioId) ||
    usuarioId <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "La sesión no contiene un usuario válido",
      },
      { status: 401 }
    );
  }

  try {
    const filas = await withUserEmail(
      session.user.correo,
      async () =>
        db.transaction(async (tx) => {
          await expirarComprasVencidas(
            tx,
            {
              usuarioId,
            }
          );

          return tx
            .select({
              idCompra:
                comprasCursos.idcompra,
              folioCompra:
                comprasCursos.foliocompra,
              usuarioId:
                comprasCursos.idusuario,
              cursoId:
                comprasCursos.idcurso,
              tituloCurso:
                cursos.tituloCurso,
              cantidadCupos:
                comprasCursos.cantidadcupos,
              precioUnitario:
                comprasCursos.preciounitario,
              subtotal:
                comprasCursos.subtotal,
              descuento:
                comprasCursos.descuento,
              total:
                comprasCursos.total,
              estado:
                estadosCompra.nombre,
              fechaCompra:
                comprasCursos.fechacompra,
              fechaLimitePago:
                comprasCursos.fechalimitepago,
              observaciones:
                comprasCursos.observaciones,
            })
            .from(comprasCursos)
            .innerJoin(
              cursos,
              eq(
                comprasCursos.idcurso,
                cursos.idCurso
              )
            )
            .innerJoin(
              estadosCompra,
              eq(
                comprasCursos.idestadocompra,
                estadosCompra.idestadocompra
              )
            )
            .where(
              eq(
                comprasCursos.idusuario,
                usuarioId
              )
            )
            .orderBy(
              desc(
                comprasCursos.fechacompra
              ),
              desc(
                comprasCursos.idcompra
              )
            );
        })
    );

    const compras: CompraCursoListaItem[] =
      filas.map((fila) => {
        const fechaLimitePago =
          fechaToString(
            fila.fechaLimitePago,
            "la fecha límite de pago"
          );

        return {
          idCompra:
            idToSafeNumber(
              fila.idCompra,
              "idCompra"
            ),
          folioCompra:
            fila.folioCompra,
          usuarioId:
            fila.usuarioId,
          cursoId:
            fila.cursoId,
          tituloCurso:
            fila.tituloCurso,
          cantidadCupos:
            fila.cantidadCupos,
          precioUnitario:
            fila.precioUnitario,
          subtotal:
            fila.subtotal,
          descuento:
            fila.descuento,
          total:
            fila.total,
          estado:
            fila.estado,
          fechaCompra:
            fechaToString(
              fila.fechaCompra,
              "la fecha de compra"
            ),
          fechaLimitePago,
          observaciones:
            fila.observaciones,

          // Después de ejecutar la expiración,
          // una compra vencida ya aparece como
          // "Expirada" y no como pendiente.
          pagoVencido:
            fila.estado === "Expirada",
        };
      });

    const response:
      ListarComprasCursosResponse = {
        compras,
        total: compras.length,
      };

    return NextResponse.json(
      response,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Error listando compras de cursos:",
      error
    );

    if (
      error instanceof
      CompraCursoError
    ) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error interno al obtener las compras",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  const usuarioId = Number(
    session.user.id
  );

  if (
    !Number.isInteger(usuarioId) ||
    usuarioId <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "La sesión no contiene un usuario válido",
      },
      { status: 401 }
    );
  }

  try {
    const body: unknown =
      await request.json();

    const validation =
      validarCrearCompraCurso(body);

    if (!validation.success) {
      return validationErrorResponse(
        validation
      );
    }

    const input: CrearCompraCursoInput =
      validation.data;

    const resultado = await withUserEmail(
      session.user.correo,
      async () =>
        db.transaction(async (tx) => {
          await tx.execute(sql`
            SELECT id_curso
            FROM academia.cursos
            WHERE id_curso = ${input.cursoId}
            FOR UPDATE
          `);

          const cursosEncontrados =
            await tx
              .select({
                idCurso: cursos.idCurso,
                tituloCurso:
                  cursos.tituloCurso,
                cupoMaximo:
                  cursos.cupoMaximo,
                cuposOcupados:
                  cursos.cuposOcupados,
                costo: cursos.costo,
                activo: cursos.activo,
                fechaInicio:
                  cursos.fechaInicio,
              })
              .from(cursos)
              .where(
                eq(
                  cursos.idCurso,
                  input.cursoId
                )
              )
              .limit(1);

          const curso =
            cursosEncontrados[0];

          if (!curso) {
            throw new CompraCursoError(
              "Curso no encontrado",
              404
            );
          }

          if (curso.activo !== true) {
            throw new CompraCursoError(
              "El curso no está disponible para compra",
              409
            );
          }

          const fechaInicio =
            new Date(
              `${curso.fechaInicio}T00:00:00`
            );

          if (
            Number.isNaN(
              fechaInicio.getTime()
            ) ||
            fechaInicio.getTime() <
              Date.now()
          ) {
            throw new CompraCursoError(
              "El curso ya inició y no acepta nuevas compras",
              409
            );
          }

          const estadosEncontrados =
            await tx
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
                    ESTADO_PENDIENTE_PAGO
                  ),
                  eq(
                    estadosCompra.activo,
                    true
                  )
                )
              )
              .limit(1);

          const estado =
            estadosEncontrados[0];

          if (!estado) {
            throw new CompraCursoError(
              `No existe el estado "${ESTADO_PENDIENTE_PAGO}" en el catálogo`,
              500
            );
          }

          const reservas = await tx
            .select({
              totalReservado: sql<number>`
                COALESCE(
                  SUM(${comprasCursos.cantidadcupos}),
                  0
                )::int
              `,
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
              and(
                eq(
                  comprasCursos.idcurso,
                  input.cursoId
                ),
                inArray(
                  estadosCompra.nombre,
                  [...ESTADOS_CON_RESERVA]
                ),
                sql`
                  ${comprasCursos.fechalimitepago}
                  > CURRENT_TIMESTAMP
                `
              )
            );

          const cuposReservados =
            Number(
              reservas[0]
                ?.totalReservado ?? 0
            );

          const cupoMaximo =
            Number(curso.cupoMaximo);

          const cuposOcupados =
            Number(
              curso.cuposOcupados ?? 0
            );

          if (
            !Number.isInteger(cupoMaximo) ||
            cupoMaximo <= 0
          ) {
            throw new CompraCursoError(
              "El cupo máximo del curso no es válido",
              500
            );
          }

          const cuposDisponibles =
            cupoMaximo -
            cuposOcupados -
            cuposReservados;

          if (
            input.cantidadCupos >
            cuposDisponibles
          ) {
            throw new CompraCursoError(
              cuposDisponibles <= 0
                ? "El curso ya no tiene cupos disponibles"
                : `Solo quedan ${cuposDisponibles} cupos disponibles`,
              409
            );
          }

          const idsParticipantesExistentes =
            input.participantes
              .filter(
                esParticipanteExistente
              )
              .map(
                (participante) =>
                  participante.participanteId
              );

          const participantesExistentes =
            idsParticipantesExistentes
              .length > 0
              ? await tx
                  .select({
                    idParticipante:
                      participantes.idParticipante,
                    usuarioId:
                      participantes.usuarioId,
                    nombre:
                      participantes.nombre,
                    apellidoPaterno:
                      participantes.apellidoPaterno,
                    apellidoMaterno:
                      participantes.apellidoMaterno,
                    fechaNacimiento:
                      participantes.fechaNacimiento,
                    sexo:
                      participantes.sexo,
                    telefono:
                      participantes.telefono,
                    correo:
                      participantes.correo,
                    activo:
                      participantes.activo,
                  })
                  .from(participantes)
                  .where(
                    and(
                      inArray(
                        participantes.idParticipante,
                        idsParticipantesExistentes.map(
                          (id) =>
                            BigInt(id)
                        )
                      ),
                      eq(
                        participantes.usuarioId,
                        usuarioId
                      ),
                      eq(
                        participantes.activo,
                        true
                      )
                    )
                  )
              : [];

          if (
            participantesExistentes.length !==
            idsParticipantesExistentes.length
          ) {
            throw new CompraCursoError(
              "Uno o más participantes no existen, están inactivos o no pertenecen a tu cuenta",
              403
            );
          }

          const existentesPorId =
            new Map<
              number,
              ParticipanteCreado
            >();

          for (
            const participante
            of participantesExistentes
          ) {
            const idParticipante =
              idToSafeNumber(
                participante.idParticipante,
                "idParticipante"
              );

            existentesPorId.set(
              idParticipante,
              {
                idParticipante,
                nombre:
                  participante.nombre,
                apellidoPaterno:
                  participante.apellidoPaterno,
                apellidoMaterno:
                  participante.apellidoMaterno,
                fechaNacimiento:
                  participante.fechaNacimiento,
                sexo:
                  normalizarSexoParticipante(
                    participante.sexo
                  ),
                telefono:
                  participante.telefono,
                correo:
                  participante.correo,
                activo:
                  participante.activo,
              }
            );
          }

          const participantesCompra:
            ParticipanteCreado[] = [];

          for (
            const participanteInput
            of input.participantes
          ) {
            if (
              esParticipanteExistente(
                participanteInput
              )
            ) {
              const participante =
                existentesPorId.get(
                  participanteInput.participanteId
                );

              if (!participante) {
                throw new CompraCursoError(
                  "Participante no disponible",
                  403
                );
              }

              participantesCompra.push(
                participante
              );

              continue;
            }

            const datos =
              participanteInput.participante;

            const insertados = await tx
              .insert(participantes)
              .values({
                usuarioId,
                nombre: datos.nombre,
                apellidoPaterno:
                  datos.apellidoPaterno,
                apellidoMaterno:
                  datos.apellidoMaterno,
                fechaNacimiento:
                  datos.fechaNacimiento,
                sexo: datos.sexo,
                telefono:
                  datos.telefono,
                correo: datos.correo,
                activo: true,
              })
              .returning({
                idParticipante:
                  participantes.idParticipante,
                nombre:
                  participantes.nombre,
                apellidoPaterno:
                  participantes.apellidoPaterno,
                apellidoMaterno:
                  participantes.apellidoMaterno,
                fechaNacimiento:
                  participantes.fechaNacimiento,
                sexo:
                  participantes.sexo,
                telefono:
                  participantes.telefono,
                correo:
                  participantes.correo,
                activo:
                  participantes.activo,
              });

            const participanteNuevo =
              insertados[0];

            if (!participanteNuevo) {
              throw new CompraCursoError(
                "No se pudo registrar uno de los participantes",
                500
              );
            }

            participantesCompra.push({
              idParticipante:
                idToSafeNumber(
                  participanteNuevo.idParticipante,
                  "idParticipante"
                ),
              nombre:
                participanteNuevo.nombre,
              apellidoPaterno:
                participanteNuevo.apellidoPaterno,
              apellidoMaterno:
                participanteNuevo.apellidoMaterno,
              fechaNacimiento:
                participanteNuevo.fechaNacimiento,
              sexo:
                normalizarSexoParticipante(
                  participanteNuevo.sexo
                ),
              telefono:
                participanteNuevo.telefono,
              correo:
                participanteNuevo.correo,
              activo:
                participanteNuevo.activo,
            });
          }

          if (
            participantesCompra.length !==
            input.cantidadCupos
          ) {
            throw new CompraCursoError(
              "La cantidad de participantes no coincide con los cupos solicitados",
              400
            );
          }

          const precioUnitarioCents =
            decimalToCents(
              curso.costo
            );

          const subtotalCents =
            precioUnitarioCents *
            input.cantidadCupos;

          if (
            !Number.isSafeInteger(
              subtotalCents
            )
          ) {
            throw new CompraCursoError(
              "El total de la compra excede el rango permitido",
              500
            );
          }

          const precioUnitario =
            centsToDecimal(
              precioUnitarioCents
            );

          const subtotal =
            centsToDecimal(
              subtotalCents
            );

          const descuento = "0.00";
          const total = subtotal;

          const fechaLimitePago =
            crearFechaLimitePago();

          const comprasInsertadas =
            await tx
              .insert(comprasCursos)
              .values({
                idusuario: usuarioId,
                idcurso:
                  curso.idCurso,
                idestadocompra:
                  estado.idEstado,
                cantidadcupos:
                  input.cantidadCupos,
                preciounitario:
                  precioUnitario,
                subtotal,
                descuento,
                total,
                fechalimitepago:
                  fechaLimitePago,
                observaciones:
                  input.observacionesUsuario,
              })
              .returning({
                idCompra:
                  comprasCursos.idcompra,
                folioCompra:
                  comprasCursos.foliocompra,
                fechaCompra:
                  comprasCursos.fechacompra,
                fechaLimitePago:
                  comprasCursos.fechalimitepago,
              });

          const compraInsertada =
            comprasInsertadas[0];

          if (!compraInsertada) {
            throw new CompraCursoError(
              "No se pudo crear la compra",
              500
            );
          }

          const idCompra =
            idToSafeNumber(
              compraInsertada.idCompra,
              "idCompra"
            );

          const relaciones =
            participantesCompra.map(
              (
                participante,
                index
              ) => ({
                idCompra,
                idParticipante:
                  participante.idParticipante,
                numeroCupo:
                  index + 1,
                estado:
                  "Registrado",
                observaciones: null,
              })
            );

          const relacionesInsertadas =
            await tx
              .insert(
                compraParticipantes
              )
              .values(relaciones)
              .returning({
                idCompraParticipante:
                  compraParticipantes.idCompraParticipante,
                idParticipante:
                  compraParticipantes.idParticipante,
                numeroCupo:
                  compraParticipantes.numeroCupo,
                estado:
                  compraParticipantes.estado,
                observaciones:
                  compraParticipantes.observaciones,
              });

          if (
            relacionesInsertadas.length !==
            input.cantidadCupos
          ) {
            throw new CompraCursoError(
              "No se pudieron asociar todos los participantes a la compra",
              500
            );
          }

          await tx
            .insert(
              historialEstadosCompra
            )
            .values({
              idCompra,
              idEstadoAnterior: null,
              idEstadoNuevo:
                estado.idEstado,
              usuarioResponsable:
                usuarioId,
              origenCambio: "Usuario",
              motivo:
                "Creación de compra",
              observaciones:
                input.observacionesUsuario,
            });

          const participantesPorId =
            new Map<
              number,
              ParticipanteCreado
            >(
              participantesCompra.map(
                (participante) => [
                  participante.idParticipante,
                  participante,
                ]
              )
            );

          const response:
            CrearCompraCursoResponse = {
            compra: {
              idCompra,
              folioCompra:
                compraInsertada.folioCompra,
              usuarioId,
              cursoId:
                curso.idCurso,
              tituloCurso:
                curso.tituloCurso,
              cantidadCupos:
                input.cantidadCupos,
              precioUnitario,
              subtotal,
              descuento,
              total,
              estado:
                estado.nombre,
              fechaCompra:
                fechaToString(
                  compraInsertada.fechaCompra,
                  "la fecha de compra"
                ),
              fechaLimitePago:
                fechaToString(
                  compraInsertada.fechaLimitePago,
                  "la fecha límite de pago"
                ),
            },

            participantes:
              relacionesInsertadas.map(
                (relacion) => {
                  const idParticipante =
                    idToSafeNumber(
                      relacion.idParticipante,
                      "idParticipante"
                    );

                  const participante =
                    participantesPorId.get(
                      idParticipante
                    );

                  if (!participante) {
                    throw new CompraCursoError(
                      "No se pudo construir la respuesta de participantes",
                      500
                    );
                  }

                  return {
                    idCompraParticipante:
                      idToSafeNumber(
                        relacion.idCompraParticipante,
                        "idCompraParticipante"
                      ),
                    numeroCupo:
                      relacion.numeroCupo,
                    estado:
                      relacion.estado,
                    observaciones:
                      relacion.observaciones,
                    participante: {
                      ...participante,
                      usuarioId,
                    },
                  };
                }
              ),
          };

          return response;
        })
    );

    return NextResponse.json(
      resultado,
      {
        status: 201,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Error creando compra de curso:",
      error
    );

    if (
      error instanceof
      CompraCursoError
    ) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        }
      );
    }

    if (
      hasPostgresCode(
        error,
        "23505"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "La compra contiene participantes o números de cupo duplicados",
        },
        { status: 409 }
      );
    }

    if (
      hasPostgresCode(
        error,
        "23503"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "El curso, usuario, estado o participante relacionado no existe",
        },
        { status: 409 }
      );
    }

    if (
      hasPostgresCode(
        error,
        "23514"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "La compra no cumple las reglas de validación de la base de datos",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error interno al crear la compra",
      },
      { status: 500 }
    );
  }
}