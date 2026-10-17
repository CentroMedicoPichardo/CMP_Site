
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  and,
  desc,
  eq,
  inArray,
  sql,
} from "drizzle-orm";

import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  preguntasUsuarios,
  usuarios,
} from "@/lib/schema";

const TITULO_SOLICITUD =
  "Solicitud ARCO - Eliminacion de cuenta";

const MARCADOR_BAJA_LOGICA =
  "[BAJA_LOGICA_CONFIRMADA_WEB]";

const ESTADOS_ABIERTOS = [
  "pendiente",
  "respondida",
];

const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

function responder(
  data: unknown,
  status = 200,
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

/**
 * A17 - Derecho ARCO de Cancelación.
 *
 * DELETE /api/account
 *
 * Registra una solicitud de eliminación
 * desde CMP_Movil para su revisión
 * administrativa.
 *
 * No elimina datos personales ni
 * desactiva la cuenta.
 *
 * La reautenticación, el bloqueo por
 * usuario y el registro de la solicitud
 * se realizan dentro de una transacción.
 *
 * Las solicitudes móviles de eliminación
 * permanecen separadas de las solicitudes
 * web de baja lógica.
 */
export async function DELETE(
  request: Request,
) {
  // CMP_Movil debe utilizar un access token Bearer.
  const authorization =
    request.headers.get("authorization");

  if (
    !authorization ||
    !/^Bearer\s+\S+$/i.test(authorization)
  ) {
    return responder(
      {
        message: "Se requiere autenticación móvil",
      },
      401,
    );
  }

  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      {
        message: "No autenticado",
      },
      401,
    );
  }

  if (session.user.rol !== "cliente") {
    return responder(
      {
        message:
          "La cancelación de esta cuenta requiere atención administrativa",
      },
      403,
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
      {
        message:
          "La solicitud no tiene un formato válido",
      },
      400,
    );
  }

  const body =
    payload as Record<string, unknown>;

  const campos = Object.keys(body);

  if (
    campos.length !== 2 ||
    !campos.includes("confirmacion") ||
    !campos.includes("contrasena") ||
    body.confirmacion !== true ||
    typeof body.contrasena !== "string" ||
    body.contrasena.length < 1 ||
    body.contrasena.length > 200
  ) {
    return responder(
      {
        message:
          "Confirma la solicitud e ingresa tu contraseña actual",
      },
      400,
    );
  }

  const usuarioId = session.user.id;
  const contrasena = body.contrasena;

  try {
    const resultado = await db.transaction(
      async (tx) => {
        /*
         * Bloqueo compartido con:
         *
         * - POST /api/account/web-request
         * - POST /api/admin/arco/cancelaciones/[id]/desactivar
         *
         * Orden de bloqueo:
         * advisory -> usuario -> solicitud.
         */
        await tx.execute(sql`
          SELECT pg_advisory_xact_lock(
            170017,
            ${usuarioId}
          )
        `);

        /*
         * Releer la cuenta dentro de la transacción.
         *
         * Si un administrador ya la desactivó,
         * no debe generarse una solicitud nueva
         * utilizando una comprobación anterior.
         */
        const [usuario] = await tx
          .select({
            id: usuarios.id,
            activo: usuarios.activo,
            contrasena: usuarios.contrasena,
            intentosFallidos: usuarios.intentosFallidos,
            bloqueadoHasta: usuarios.bloqueadoHasta,
          })
          .from(usuarios)
          .where(
            eq(usuarios.id, usuarioId)
          )
          .limit(1)
          .for("update");

        if (
          !usuario ||
          usuario.activo !== true
        ) {
          return {
            tipo: "error" as const,
            status: 404,
            message: "Cuenta no disponible",
          };
        }

        /*
         * Respetar el bloqueo temporal por
         * intentos fallidos de contraseña.
         */
        const ahora = new Date();

        const hasta = usuario.bloqueadoHasta
          ? new Date(usuario.bloqueadoHasta)
          : null;

        const fechaBloqueoValida = Boolean(
          hasta &&
          !Number.isNaN(hasta.getTime())
        );

        if (
          fechaBloqueoValida &&
          hasta &&
          hasta > ahora
        ) {
          return {
            tipo: "error" as const,
            status: 423,
            message:
              "La cuenta está bloqueada temporalmente.",
          };
        }

        /*
         * Al vencer un bloqueo temporal,
         * comenzar un nuevo conteo de intentos.
         */
        const bloqueoVencido = Boolean(
          fechaBloqueoValida &&
          hasta &&
          hasta <= ahora
        );

        const intentosAnteriores = bloqueoVencido
          ? 0
          : Math.max(
              0,
              Number(usuario.intentosFallidos ?? 0),
            );

        /*
         * La contraseña se comprueba mientras
         * la fila del usuario está bloqueada.
         */
        const contrasenaValida =
          await bcrypt.compare(
            contrasena,
            usuario.contrasena,
          );

        if (!contrasenaValida) {
          const intentos =
            intentosAnteriores + 1;

          const bloqueo =
            intentos >= MAX_INTENTOS
              ? new Date(
                  ahora.getTime() +
                  MINUTOS_BLOQUEO * 60_000,
                ).toISOString()
              : null;

          await tx
            .update(usuarios)
            .set({
              intentosFallidos: intentos,
              bloqueadoHasta: bloqueo,
            })
            .where(
              eq(usuarios.id, usuario.id),
            );

          if (intentos >= MAX_INTENTOS) {
            return {
              tipo: "error" as const,
              status: 423,
              message:
                "Demasiados intentos incorrectos. " +
                "La cuenta se bloqueó temporalmente.",
            };
          }

          return {
            tipo: "error" as const,
            status: 403,
            message:
              "La contraseña es incorrecta",
          };
        }

        /*
         * Contraseña correcta:
         * restablecer el contador.
         */
        await tx
          .update(usuarios)
          .set({
            intentosFallidos: 0,
            bloqueadoHasta: null,
          })
          .where(
            eq(usuarios.id, usuario.id),
          );

        /*
         * Buscar exclusivamente solicitudes
         * móviles de eliminación abiertas.
         *
         * No reutilizar solicitudes web que
         * contienen consentimiento de baja lógica.
         *
         * POSITION realiza una comparación
         * literal y parametrizada del marcador.
         */
        const [existente] = await tx
          .select({
            id: preguntasUsuarios.idPregunta,
            estado: preguntasUsuarios.estado,
          })
          .from(preguntasUsuarios)
          .where(
            and(
              eq(
                preguntasUsuarios.idUsuario,
                usuario.id,
              ),
              eq(
                preguntasUsuarios.titulo,
                TITULO_SOLICITUD,
              ),
              eq(
                preguntasUsuarios.esPrivada,
                true,
              ),
              inArray(
                preguntasUsuarios.estado,
                ESTADOS_ABIERTOS,
              ),
              sql<boolean>`
                POSITION(
                  ${MARCADOR_BAJA_LOGICA}
                  IN ${preguntasUsuarios.descripcion}
                ) = 0
              `,
            ),
          )
          .orderBy(
            desc(
              preguntasUsuarios.idPregunta,
            ),
          )
          .limit(1);

        if (existente) {
          return {
            tipo: "solicitud" as const,
            solicitudId: existente.id,
            estado:
              existente.estado ?? "pendiente",
            yaExistia: true,
          };
        }

        /*
         * Crear una solicitud nueva
         * de eliminación de datos.
         *
         * No convertir solicitudes anteriores
         * ni modificar solicitudes de baja lógica.
         */
        const [nueva] = await tx
          .insert(preguntasUsuarios)
          .values({
            idUsuario: usuario.id,
            idCategoria: null,
            titulo: TITULO_SOLICITUD,

            descripcion:
              "Solicitud de eliminación " +
              "de cuenta y datos personales " +
              "realizada desde CMP_Movil. " +
              "Requiere revisión de compras, " +
              "pagos, participantes, " +
              "inscripciones y demás datos " +
              "relacionados antes de ejecutar " +
              "su tratamiento final.",

            estado: "pendiente",
            prioridad: "alta",
            esPrivada: true,

            updatedAt:
              new Date().toISOString(),
          })
          .returning({
            id: preguntasUsuarios.idPregunta,
          });

        if (!nueva) {
          throw new Error(
            "No se generó el folio",
          );
        }

        return {
          tipo: "solicitud" as const,
          solicitudId: nueva.id,
          estado: "pendiente",
          yaExistia: false,
        };
      },
    );

    /*
     * Mantener los códigos y mensajes
     * esperados por CMP_Movil.
     */
    if (resultado.tipo === "error") {
      return responder(
        {
          message: resultado.message,
        },
        resultado.status,
      );
    }

    return responder(
      {
        message: resultado.yaExistia
          ? "Ya tienes una solicitud " +
            "de eliminación en proceso."
          : "Tu solicitud de eliminación " +
            "fue registrada correctamente.",

        solicitudId:
          resultado.solicitudId,

        estado:
          resultado.estado,

        eliminacionCompletada: false,
      },
      202,
    );
  } catch (errorServidor) {
    console.error(
      "Error al registrar cancelación:",
      errorServidor,
    );

    return responder(
      {
        message:
          "No fue posible registrar " +
          "la solicitud de eliminación",
      },
      500,
    );
  }
}
