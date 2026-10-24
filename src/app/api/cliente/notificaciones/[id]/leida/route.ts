
import { NextResponse } from "next/server";
import { and, eq, ne, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { notificacionesAcademicas } from "@/lib/schema";
import { requireApiAuth } from "@/lib/auth";
import {
  ESTADO_LEIDA,
  aNotificacionDto,
  buscarNotificacionDelUsuario,
} from "@/lib/cliente-notificaciones/notificaciones";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

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

function parseId(valor: string): number | null {
  if (!/^\d+$/.test(valor)) {
    return null;
  }

  const numero = Number(valor);

  return Number.isSafeInteger(numero) &&
    numero > 0
    ? numero
    : null;
}

// Marca como leída una notificación propia.
// Idempotente: si ya estaba leída responde 200 igual.
// Una notificación ajena o inexistente da 404 para no
// revelar su existencia.
export async function PATCH(
  _request: Request,
  { params }: RouteContext
) {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  const id = parseId((await params).id);

  if (id === null) {
    return responder(
      { message: "Identificador inválido" },
      400
    );
  }

  try {
    const actual =
      await buscarNotificacionDelUsuario(
        id,
        session.user.id
      );

    if (!actual) {
      return responder(
        { message: "Notificación no encontrada" },
        404
      );
    }

    if (actual.estadoEnvio === ESTADO_LEIDA) {
      return responder(aNotificacionDto(actual));
    }

    // La tabla exige fecha_envio para estar 'Leída'
    // (chk_notificacion_enviada).
    if (!actual.fechaEnvio) {
      return responder(
        {
          message:
            "La notificación aún no ha sido enviada",
        },
        409
      );
    }

    // fecha_lectura debe ser >= fecha_envio
    // (chk_notificacion_fecha_lectura).
    const ahora = new Date().toISOString();

    await db
      .update(notificacionesAcademicas)
      .set({
        estadoEnvio: ESTADO_LEIDA,
        fechaLectura: sql`GREATEST(${ahora}::timestamp, ${notificacionesAcademicas.fechaEnvio})`,
        updatedAt: ahora,
      })
      .where(
        and(
          eq(
            notificacionesAcademicas.idNotificacion,
            BigInt(id)
          ),
          ne(
            notificacionesAcademicas.estadoEnvio,
            ESTADO_LEIDA
          )
        )
      );

    const actualizada =
      await buscarNotificacionDelUsuario(
        id,
        session.user.id
      );

    if (!actualizada) {
      return responder(
        { message: "Notificación no encontrada" },
        404
      );
    }

    return responder(aNotificacionDto(actualizada));
  } catch (error) {
    console.error(
      "Error al marcar notificación como leída:",
      error
    );

    return responder(
      {
        message:
          "No fue posible marcar la notificación como leída",
      },
      500
    );
  }
}
