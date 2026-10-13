
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

const ESTADOS_ABIERTOS = [
  "pendiente",
  "respondida",
];

const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

function responder(
  data: unknown,
  status = 200
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
 * Primera etapa:
 *
 * Registra una solicitud privada de
 * eliminación para revisión administrativa.
 *
 * No elimina ni desactiva la cuenta.
 */
export async function DELETE(
  request: Request
) {
  // Solo se permite el access token
  // utilizado por CMP_Movil.
  const authorization =
    request.headers.get("authorization");

  if (
    !authorization ||
    !/^Bearer\s+\S+$/i.test(authorization)
  ) {
    return responder(
      {
        message:
          "Se requiere autenticación móvil",
      },
      401
    );
  }

  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  // Las cuentas administrativas requieren
  // un procedimiento distinto.
  if (session.user.rol !== "cliente") {
    return responder(
      {
        message:
          "La cancelación de esta cuenta requiere atención administrativa",
      },
      403
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
      400
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
      400
    );
  }

  try {
    const [usuario] = await db
      .select({
        id: usuarios.id,
        contrasena: usuarios.contrasena,
      })
      .from(usuarios)
      .where(
        and(
          eq(usuarios.id, session.user.id),
          eq(usuarios.activo, true)
        )
      )
      .limit(1);

    if (!usuario) {
      return responder(
        {
          message: "Cuenta no disponible",
        },
        404
      );
    }

    // Reautenticación antes de registrar
    // una solicitud sensible.
    const contrasenaValida =
      await bcrypt.compare(
        body.contrasena,
        usuario.contrasena
      );

    if (!contrasenaValida) {
      // Reutiliza el contador de seguridad
      // ya existente en seguridad.usuarios.
      const [actualizado] = await db
        .update(usuarios)
        .set({
          intentosFallidos: sql`
            COALESCE(
              ${usuarios.intentosFallidos},
              0
            ) + 1
          `,
        })
        .where(
          eq(usuarios.id, usuario.id)
        )
        .returning({
          intentosFallidos:
            usuarios.intentosFallidos,
        });

      const intentos =
        actualizado?.intentosFallidos ?? 0;

      if (intentos >= MAX_INTENTOS) {
        const bloqueo = new Date();

        bloqueo.setMinutes(
          bloqueo.getMinutes() +
            MINUTOS_BLOQUEO
        );

        await db
          .update(usuarios)
          .set({
            bloqueadoHasta:
              bloqueo.toISOString(),
          })
          .where(
            eq(usuarios.id, usuario.id)
          );

        return responder(
          {
            message:
              "Demasiados intentos incorrectos. " +
              "La cuenta se bloqueó temporalmente.",
          },
          423
        );
      }

      return responder(
        {
          message:
            "La contraseña es incorrecta",
        },
        403
      );
    }

    // Restablecer el contador después
    // de verificar la contraseña.
    await db
      .update(usuarios)
      .set({
        intentosFallidos: 0,
        bloqueadoHasta: null,
      })
      .where(
        eq(usuarios.id, usuario.id)
      );

    /*
     * La transacción y el bloqueo
     * por usuario impiden que dos
     * peticiones simultáneas creen
     * dos solicitudes abiertas.
     */
    const resultado =
      await db.transaction(async (tx) => {
        await tx.execute(sql`
          SELECT pg_advisory_xact_lock(
            170017,
            ${usuario.id}
          )
        `);

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
                usuario.id
              ),
              eq(
                preguntasUsuarios.titulo,
                TITULO_SOLICITUD
              ),
              inArray(
                preguntasUsuarios.estado,
                ESTADOS_ABIERTOS
              )
            )
          )
          .orderBy(
            desc(preguntasUsuarios.idPregunta)
          )
          .limit(1);

        if (existente) {
          return {
            solicitudId: existente.id,
            estado:
              existente.estado ?? "pendiente",
            yaExistia: true,
          };
        }

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
            "No se generó el folio"
          );
        }

        return {
          solicitudId: nueva.id,
          estado: "pendiente",
          yaExistia: false,
        };
      });

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
      202
    );
  } catch (errorServidor) {
    console.error(
      "Error al registrar cancelación:",
      errorServidor
    );

    return responder(
      {
        message:
          "No fue posible registrar " +
          "la solicitud de eliminación",
      },
      500
    );
  }
}
