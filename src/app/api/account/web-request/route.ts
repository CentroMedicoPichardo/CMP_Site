
import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { normalizeRole, requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { preguntasUsuarios, usuarios } from "@/lib/schema/index";

const TITULO_ARCO =
  "Solicitud ARCO - Eliminacion de cuenta";

const MARCADOR_CONSENTIMIENTO =
  "[BAJA_LOGICA_CONFIRMADA_WEB]";

const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

/**
 * A17 - Solicitud de baja lógica desde CMP_Site.
 *
 * Requiere sesión web válida, rol cliente,
 * contraseña actual y confirmación expresa.
 *
 * Reutiliza exclusivamente solicitudes de baja
 * lógica pendientes y confirmadas.
 *
 * No modifica solicitudes de eliminación de
 * datos personales registradas desde CMP_Movil.
 *
 * No desactiva cuentas ni elimina información.
 */
export async function POST(request: NextRequest) {
  const origen = request.headers.get("origin");

  if (!origen || origen !== request.nextUrl.origin) {
    return json(
      { message: "Origen no permitido." },
      403,
    );
  }

  const { session, error } = await requireApiAuth();

  if (error) return error;

  if (!session) {
    return json(
      { message: "Inicia sesión para continuar." },
      401,
    );
  }

  if (normalizeRole(session.user.rol) !== "cliente") {
    return json(
      {
        message:
          "Disponible solo para cuentas de cliente.",
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
    return json(
      { message: "Solicitud inválida." },
      400,
    );
  }

  const body = payload as Record<string, unknown>;

  if (
    body.confirmacion !== true ||
    typeof body.contrasena !== "string" ||
    body.contrasena.length === 0 ||
    body.contrasena.length > 1024
  ) {
    return json(
      {
        message:
          "Debes confirmar la solicitud e introducir tu contraseña.",
      },
      400,
    );
  }

  const contrasena = body.contrasena;
  const usuarioId = session.user.id;

  try {
    const resultado = await db.transaction(async (tx) => {
      /*
       * Orden de bloqueo compartido con los demás
       * procedimientos de A17:
       *
       * advisory -> usuario -> solicitud.
       */
      await tx.execute(sql`
        SELECT pg_advisory_xact_lock(
          170017,
          ${usuarioId}
        )
      `);

      const [usuario] = await tx
        .select({
          id: usuarios.id,
          activo: usuarios.activo,
          contrasena: usuarios.contrasena,
          intentosFallidos: usuarios.intentosFallidos,
          bloqueadoHasta: usuarios.bloqueadoHasta,
        })
        .from(usuarios)
        .where(eq(usuarios.id, usuarioId))
        .limit(1)
        .for("update");

      if (!usuario || usuario.activo !== true) {
        return {
          status: 403,
          message: "Cuenta no disponible.",
        };
      }

      const ahora = new Date();

      const hasta = usuario.bloqueadoHasta
        ? new Date(usuario.bloqueadoHasta)
        : null;

      if (
        hasta &&
        !Number.isNaN(hasta.getTime()) &&
        hasta > ahora
      ) {
        return {
          status: 423,
          message: "Cuenta temporalmente bloqueada.",
        };
      }

      const baseIntentos =
        hasta && hasta <= ahora
          ? 0
          : Number(usuario.intentosFallidos ?? 0);

      const valida = await bcrypt.compare(
        contrasena,
        usuario.contrasena,
      );

      if (!valida) {
        const intentos = baseIntentos + 1;

        const bloqueadoHasta =
          intentos >= MAX_INTENTOS
            ? new Date(
                ahora.getTime() +
                  BLOQUEO_MINUTOS * 60_000,
              ).toISOString()
            : null;

        await tx
          .update(usuarios)
          .set({
            intentosFallidos: intentos,
            bloqueadoHasta,
          })
          .where(eq(usuarios.id, usuarioId));

        return {
          status: intentos >= MAX_INTENTOS ? 423 : 401,
          message:
            intentos >= MAX_INTENTOS
              ? "Cuenta bloqueada temporalmente por intentos fallidos."
              : "Contraseña incorrecta.",
        };
      }

      // Contraseña correcta: restablecer el bloqueo.
      await tx
        .update(usuarios)
        .set({
          intentosFallidos: 0,
          bloqueadoHasta: null,
        })
        .where(eq(usuarios.id, usuarioId));

      /*
       * Buscar exclusivamente una solicitud
       * de baja lógica pendiente.
       *
       * POSITION compara literalmente el marcador.
       * No usa comodines como LIKE.
       *
       * Las solicitudes anteriores de eliminación
       * y las solicitudes respondidas no se alteran.
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
              usuarioId,
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
            sql<boolean>`
              POSITION(
                ${MARCADOR_CONSENTIMIENTO}
                IN ${preguntasUsuarios.descripcion}
              ) > 0
            `,
          ),
        )
        .orderBy(
          desc(preguntasUsuarios.idPregunta),
        )
        .limit(1);

      if (existente) {
        return {
          status: 200,
          message:
            "Ya existe una solicitud de baja lógica pendiente para esta cuenta.",
          solicitudId: existente.id,
          estado: existente.estado,
          eliminacionCompletada: false,
        };
      }

      /*
       * Registrar una nueva solicitud privada.
       *
       * La confirmación se genera únicamente
       * tras autenticar al titular y validar
       * su contraseña.
       */
      const [creada] = await tx
        .insert(preguntasUsuarios)
        .values({
          idUsuario: usuarioId,
          titulo: TITULO_ARCO,
          descripcion:
            "Solicitud autenticada de baja lógica de cuenta. " +
            "El titular solicita desactivar el acceso. " +
            "Este trámite no elimina los registros almacenados. " +
            `${MARCADOR_CONSENTIMIENTO} Confirmado desde CMP_Site.`,
          esPrivada: true,
          prioridad: "alta",
          estado: "pendiente",
        })
        .returning({
          id: preguntasUsuarios.idPregunta,
        });

      if (!creada) {
        throw new Error(
          "No se generó el folio de baja lógica.",
        );
      }

      return {
        status: 202,
        message:
          "Solicitud de baja lógica registrada correctamente.",
        solicitudId: creada.id,
        estado: "pendiente",
        eliminacionCompletada: false,
      };
    });

    const { status, ...datos } = resultado;

    return json(datos, status);
  } catch (errorRegistro) {
    console.error(
      "Error al registrar la baja lógica web:",
      errorRegistro,
    );

    return json(
      {
        message:
          "No se pudo registrar la solicitud.",
      },
      500,
    );
  }
}
