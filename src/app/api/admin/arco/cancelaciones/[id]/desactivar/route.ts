
import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull, sql } from "drizzle-orm";

import { normalizeRole, requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  auditoriaAcciones,
  preguntasUsuarios,
  roles,
  usuarios,
} from "@/lib/schema";

const TITULO_ARCO =
  "Solicitud ARCO - Eliminacion de cuenta";

const MARCADOR_CONSENTIMIENTO =
  "[BAJA_LOGICA_CONFIRMADA_WEB]";

const CONFIRMACION_REQUERIDA = "DESACTIVAR CUENTA";
const VERSION_TOKEN_MAXIMA = 2147483647;

const ACCIONES_PREVISTAS = [
  "Desactivar el acceso del cliente.",
  "Invalidar sus sesiones y tokens.",
  "Cerrar la solicitud como baja lógica de acceso (sin borrar datos).",
  "Registrar una constancia administrativa de auditoría.",
  "Conservar compras, pagos, inscripciones y participantes.",
];

type Contexto = {
  params: Promise<{ id: string }>;
};

type Modo = "simular" | "ejecutar";

type SolicitudArco = {
  id: number;
  usuarioId: number;
  estado: string | null;
  descripcion: string;
};

type UsuarioArco = {
  id: number;
  activo: boolean | null;
  versionToken: number | null;
  rolId: number;
};

class ErrorArco extends Error {
  constructor(
    public readonly status: number,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = "ErrorArco";
  }
}

function responder(datos: unknown, status = 200) {
  return NextResponse.json(datos, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function validarEstado(
  solicitud: SolicitudArco | undefined,
): asserts solicitud is SolicitudArco {
  if (!solicitud) {
    throw new ErrorArco(
      404,
      "Solicitud ARCO no encontrada.",
    );
  }

  if (solicitud.estado !== "pendiente") {
    throw new ErrorArco(
      409,
      "La solicitud ya no se encuentra pendiente.",
    );
  }
}

function tieneConsentimiento(
  solicitud: SolicitudArco,
): boolean {
  return solicitud.descripcion.includes(
    MARCADOR_CONSENTIMIENTO,
  );
}

function exigirConsentimiento(
  solicitud: SolicitudArco,
) {
  if (!tieneConsentimiento(solicitud)) {
    throw new ErrorArco(
      409,
      "La solicitud no tiene confirmación expresa de baja lógica. " +
        "El cliente debe confirmar esta modalidad desde /eliminar-cuenta.",
    );
  }
}

function validarUsuario(
  usuario: UsuarioArco | undefined,
  nombreRol: string | null | undefined,
  adminId: number,
): number {
  if (!usuario) {
    throw new ErrorArco(
      404,
      "La cuenta del cliente no existe.",
    );
  }

  if (usuario.id === adminId) {
    throw new ErrorArco(
      403,
      "No puedes desactivar tu propia cuenta.",
    );
  }

  if (!nombreRol || normalizeRole(nombreRol) !== "cliente") {
    throw new ErrorArco(
      403,
      "Solo pueden desactivarse cuentas con rol cliente.",
    );
  }

  if (usuario.activo !== true) {
    throw new ErrorArco(
      409,
      "La cuenta ya está desactivada.",
    );
  }

  // Compatibilidad con usuarios antiguos:
  // NULL se interpreta como la versión inicial 1.
  const versionActual = Number(
    usuario.versionToken ?? 1,
  );

  if (
    !Number.isSafeInteger(versionActual) ||
    versionActual < 1 ||
    versionActual >= VERSION_TOKEN_MAXIMA
  ) {
    throw new ErrorArco(
      409,
      "La versión del token no permite desactivar esta cuenta.",
    );
  }

  return versionActual;
}

/**
 * A17 - Baja lógica administrativa.
 *
 * POST /api/admin/arco/cancelaciones/[id]/desactivar
 *
 * modo=simular:
 * - Consulta la solicitud y la cuenta.
 * - Verifica el consentimiento web.
 * - No realiza modificaciones.
 *
 * modo=ejecutar:
 * - Requiere autorización administrativa.
 * - Requiere habilitación explícita del servidor.
 * - Requiere confirmación del ID y frase.
 * - Requiere consentimiento del cliente.
 * - Desactiva el acceso e invalida tokens.
 * - Cierra la solicitud y registra auditoría.
 *
 * No elimina ni anonimiza datos personales.
 */
export async function POST(
  request: NextRequest,
  { params }: Contexto,
) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return responder(
      { message: "No autenticado" },
      401,
    );
  }

  // Validar origen de la petición administrativa.
  const origen = request.headers.get("origin");
  const origenPermitido = new URL(request.url).origin;

  const contextoNavegador =
    request.headers.get("sec-fetch-site");

  if (
    origen !== origenPermitido ||
    (
      contextoNavegador !== null &&
      contextoNavegador !== "same-origin" &&
      contextoNavegador !== "none"
    )
  ) {
    return responder(
      {
        message:
          "El origen de la petición no está autorizado.",
      },
      403,
    );
  }

  const tipoContenido =
    request.headers.get("content-type") ?? "";

  if (
    !/^application\/json(?:\s*;|\s*$)/i.test(
      tipoContenido,
    )
  ) {
    return responder(
      {
        message:
          "La petición debe enviarse como JSON.",
      },
      415,
    );
  }

  const { id } = await params;
  const solicitudId = Number(id);

  if (
    !Number.isSafeInteger(solicitudId) ||
    solicitudId <= 0
  ) {
    return responder(
      {
        message:
          "El identificador de la solicitud no es válido.",
      },
      400,
    );
  }

  const payload: unknown =
    await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return responder(
      { message: "Cuerpo JSON inválido." },
      400,
    );
  }

  const body = payload as Record<string, unknown>;

  if (
    body.modo !== "simular" &&
    body.modo !== "ejecutar"
  ) {
    return responder(
      {
        message:
          "El modo debe ser simular o ejecutar.",
      },
      400,
    );
  }

  const modo: Modo = body.modo;

  /*
   * La ejecución permanece deshabilitada
   * salvo configuración explícita.
   *
   * También aplica a localhost, ya que
   * utiliza PostgreSQL de producción.
   */
  const ejecucionHabilitada =
    process.env.ARCO_DESACTIVACION_HABILITADA === "true";

  if (modo === "ejecutar") {
    if (!ejecucionHabilitada) {
      return responder(
        {
          message:
            "La desactivación real está deshabilitada en el servidor.",
          ejecucionHabilitada: false,
          ejecutada: false,
        },
        423,
      );
    }

    if (
      body.confirmacion !==
      CONFIRMACION_REQUERIDA
    ) {
      return responder(
        {
          message:
            "La frase de confirmación no coincide.",
        },
        400,
      );
    }

    if (
      typeof body.usuarioIdConfirmado !== "number" ||
      !Number.isSafeInteger(body.usuarioIdConfirmado) ||
      body.usuarioIdConfirmado <= 0
    ) {
      return responder(
        {
          message:
            "Debes confirmar el ID del usuario.",
        },
        400,
      );
    }
  }

  try {
    /*
     * SIMULACIÓN
     *
     * Solo realiza consultas.
     * No bloquea filas ni modifica información.
     */
    if (modo === "simular") {
      const [solicitud] = await db
        .select({
          id: preguntasUsuarios.idPregunta,
          usuarioId: preguntasUsuarios.idUsuario,
          estado: preguntasUsuarios.estado,
          descripcion: preguntasUsuarios.descripcion,
        })
        .from(preguntasUsuarios)
        .where(
          and(
            eq(
              preguntasUsuarios.idPregunta,
              solicitudId,
            ),
            eq(
              preguntasUsuarios.titulo,
              TITULO_ARCO,
            ),
            eq(
              preguntasUsuarios.esPrivada,
              true,
            ),
          ),
        )
        .limit(1);

      validarEstado(solicitud);

      const [usuario] = await db
        .select({
          id: usuarios.id,
          activo: usuarios.activo,
          versionToken: usuarios.versionToken,
          rolId: usuarios.rolId,
          nombreRol: roles.nombre,
        })
        .from(usuarios)
        .innerJoin(
          roles,
          eq(usuarios.rolId, roles.id),
        )
        .where(
          eq(
            usuarios.id,
            solicitud.usuarioId,
          ),
        )
        .limit(1);

      validarUsuario(
        usuario,
        usuario?.nombreRol,
        session.user.id,
      );

      const modalidadConfirmada =
        tieneConsentimiento(solicitud);

      return responder({
        status: 200,
        datos: {
          message: modalidadConfirmada
            ? "Simulación completada. No se modificaron registros."
            : "Simulación completada sin cambios. " +
              "Falta confirmación expresa de baja lógica.",
          solicitudId: solicitud.id,
          usuarioId: solicitud.usuarioId,
          modo: "simular" as const,
          ejecutada: false,
          ejecucionHabilitada,
          modalidadConfirmada,
          estadoSolicitud: solicitud.estado,
          cuentaActiva: usuario?.activo === true,
          accionesPrevistas: ACCIONES_PREVISTAS,
          registrosEliminados: 0,
          datosPersonalesEliminados: false,
        },
      });
    }

    /*
     * EJECUCIÓN
     *
     * Solo se alcanza con modo=ejecutar
     * y habilitación explícita del servidor.
     */
    const resultado = await db.transaction(
      async (tx) => {
        /*
         * Primera lectura sin bloqueo.
         * Identifica al usuario de la solicitud.
         */
        const [referencia] = await tx
          .select({
            id: preguntasUsuarios.idPregunta,
            usuarioId: preguntasUsuarios.idUsuario,
          })
          .from(preguntasUsuarios)
          .where(
            and(
              eq(
                preguntasUsuarios.idPregunta,
                solicitudId,
              ),
              eq(
                preguntasUsuarios.titulo,
                TITULO_ARCO,
              ),
              eq(
                preguntasUsuarios.esPrivada,
                true,
              ),
            ),
          )
          .limit(1);

        if (!referencia) {
          throw new ErrorArco(
            404,
            "Solicitud ARCO no encontrada.",
          );
        }

        if (
          body.usuarioIdConfirmado !==
          referencia.usuarioId
        ) {
          throw new ErrorArco(
            409,
            "El ID confirmado no corresponde al cliente de la solicitud.",
          );
        }

        /*
         * Bloqueo compartido con los endpoints
         * móvil y web de solicitudes A17.
         *
         * Orden:
         * advisory -> usuario -> solicitud.
         */
        await tx.execute(sql`
          SELECT pg_advisory_xact_lock(
            170017,
            ${referencia.usuarioId}
          )
        `);

        const [usuario] = await tx
          .select({
            id: usuarios.id,
            activo: usuarios.activo,
            versionToken: usuarios.versionToken,
            rolId: usuarios.rolId,
          })
          .from(usuarios)
          .where(
            eq(
              usuarios.id,
              referencia.usuarioId,
            ),
          )
          .limit(1)
          .for("update");

        if (!usuario) {
          throw new ErrorArco(
            404,
            "La cuenta del cliente no existe.",
          );
        }

        /*
         * Bloquear la solicitud y comprobar
         * nuevamente su estado.
         */
        const [solicitud] = await tx
          .select({
            id: preguntasUsuarios.idPregunta,
            usuarioId: preguntasUsuarios.idUsuario,
            estado: preguntasUsuarios.estado,
            descripcion: preguntasUsuarios.descripcion,
          })
          .from(preguntasUsuarios)
          .where(
            and(
              eq(
                preguntasUsuarios.idPregunta,
                solicitudId,
              ),
              eq(
                preguntasUsuarios.titulo,
                TITULO_ARCO,
              ),
              eq(
                preguntasUsuarios.esPrivada,
                true,
              ),
              eq(
                preguntasUsuarios.idUsuario,
                usuario.id,
              ),
            ),
          )
          .limit(1)
          .for("update");

        validarEstado(solicitud);
        exigirConsentimiento(solicitud);

        const [rolUsuario] = await tx
          .select({
            nombre: roles.nombre,
          })
          .from(roles)
          .where(
            eq(
              roles.id,
              usuario.rolId,
            ),
          )
          .limit(1);

        const versionActual = validarUsuario(
          usuario,
          rolUsuario?.nombre,
          session.user.id,
        );

        /*
         * Corregir la comparación de versionToken.
         *
         * Si la columna tiene NULL, se exige NULL.
         * Si contiene un número, se exige ese número.
         *
         * En ambos casos el nuevo valor será
         * versionActual + 1.
         *
         * Esto evita conflictos injustificados
         * con usuarios antiguos y conserva
         * la protección contra cambios concurrentes.
         */
        const condicionVersion =
          usuario.versionToken === null
            ? isNull(usuarios.versionToken)
            : eq(
                usuarios.versionToken,
                versionActual,
              );

        const [actualizado] = await tx
          .update(usuarios)
          .set({
            activo: false,
            versionToken: versionActual + 1,
          })
          .where(
            and(
              eq(
                usuarios.id,
                usuario.id,
              ),
              eq(
                usuarios.activo,
                true,
              ),
              condicionVersion,
            ),
          )
          .returning({
            id: usuarios.id,
          });

        if (!actualizado) {
          throw new ErrorArco(
            409,
            "No fue posible desactivar la cuenta.",
          );
        }

        /*
         * Cerrar la solicitud únicamente
         * después de desactivar el acceso.
         */
        const [solicitudActualizada] = await tx
          .update(preguntasUsuarios)
          .set({
            estado: "cerrada",
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(
                preguntasUsuarios.idPregunta,
                solicitud.id,
              ),
              eq(
                preguntasUsuarios.idUsuario,
                usuario.id,
              ),
              eq(
                preguntasUsuarios.titulo,
                TITULO_ARCO,
              ),
              eq(
                preguntasUsuarios.esPrivada,
                true,
              ),
              eq(
                preguntasUsuarios.estado,
                "pendiente",
              ),
            ),
          )
          .returning({
            id: preguntasUsuarios.idPregunta,
          });

        if (!solicitudActualizada) {
          throw new ErrorArco(
            409,
            "No fue posible actualizar la solicitud.",
          );
        }

        /*
         * Registrar auditoría en la misma
         * transacción.
         *
         * Si falla, se revierten los cambios.
         */
        const [auditoria] = await tx
          .insert(auditoriaAcciones)
          .values({
            usuario: `admin:${session.user.id}`,
            accion: "ARCO_BAJA_LOGICA",
            tablaAfectada: "seguridad.usuarios",
            registroId: usuario.id,
            aplicacionOrigen: "CMP_Site",

            datosAnteriores: {
              activo: true,
              versionToken:
                usuario.versionToken,
              solicitudId: solicitud.id,
              estadoSolicitud: solicitud.estado,
              modalidadConfirmada: true,
            },

            datosNuevos: {
              activo: false,
              versionToken: versionActual + 1,
              solicitudId: solicitud.id,
              estadoSolicitud: "cerrada",
              tipoTratamiento:
                "DESACTIVACION_ACCESO",
              datosPersonalesEliminados: false,
            },
          })
          .returning({
            id: auditoriaAcciones.idAuditoria,
          });

        if (!auditoria) {
          throw new Error(
            "No fue posible registrar la auditoría.",
          );
        }

        return {
          solicitudId: solicitud.id,
          usuarioId: usuario.id,
          modo: "ejecutar" as const,
          ejecutada: true,
          cuentaActiva: false,
          modalidadConfirmada: true,
          sesionesInvalidadas: true,
          estadoSolicitud: "cerrada",
          auditoriaId: auditoria.id,
          registrosEliminados: 0,
          datosPersonalesEliminados: false,
        };
      },
    );

    return responder({
      status: 200,
      datos: {
        message:
          "La cuenta fue desactivada. " +
          "Sus registros personales, académicos y financieros siguen almacenados.",
        ...resultado,
      },
    });
  } catch (errorProceso: unknown) {
    if (errorProceso instanceof ErrorArco) {
      return responder(
        {
          message: errorProceso.message,
        },
        errorProceso.status,
      );
    }

    console.error(
      "Error en baja lógica ARCO:",
      errorProceso,
    );

    return responder(
      {
        message:
          "No fue posible procesar la baja lógica.",
      },
      500,
    );
  }
}
