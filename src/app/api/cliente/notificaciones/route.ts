
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  inscripcionesCursos,
  notificacionesAcademicas,
} from "@/lib/schema";
import { requireApiAuth } from "@/lib/auth";
import {
  aNotificacionDto,
  camposNotificacion,
  condicionEstadoVisible,
  totalesNotificaciones,
} from "@/lib/cliente-notificaciones/notificaciones";

export const dynamic = "force-dynamic";

const PAGE_SIZE_POR_DEFECTO = 20;
const PAGE_SIZE_MAXIMO = 50;

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

// Entero positivo, o el valor por defecto si
// el parámetro no viene; null si es inválido.
function parseEnteroPositivo(
  valor: string | null,
  porDefecto: number
): number | null {
  if (valor === null) {
    return porDefecto;
  }

  if (!/^\d+$/.test(valor)) {
    return null;
  }

  const numero = Number(valor);

  return Number.isSafeInteger(numero) &&
    numero > 0
    ? numero
    : null;
}

// Lista las notificaciones del usuario autenticado.
// Solo las ligadas a una inscripción propia; las de
// solo curso_id (avisos a todo el curso) no se
// exponen todavía (ver cliente-notificaciones).
export async function GET(request: Request) {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  const { searchParams } = new URL(request.url);

  const page = parseEnteroPositivo(
    searchParams.get("page"),
    1
  );

  const pageSize = parseEnteroPositivo(
    searchParams.get("pageSize"),
    PAGE_SIZE_POR_DEFECTO
  );

  if (
    page === null ||
    pageSize === null ||
    pageSize > PAGE_SIZE_MAXIMO
  ) {
    return responder(
      {
        message:
          `page debe ser un entero positivo y pageSize un entero entre 1 y ${PAGE_SIZE_MAXIMO}`,
      },
      400
    );
  }

  const propias = and(
    eq(
      inscripcionesCursos.usuarioId,
      session.user.id
    ),
    condicionEstadoVisible()
  );

  try {
    const [filas, totales] = await Promise.all([
      db
        .select(camposNotificacion)
        .from(notificacionesAcademicas)
        .innerJoin(
          inscripcionesCursos,
          eq(
            notificacionesAcademicas.inscripcionId,
            inscripcionesCursos.idInscripcion
          )
        )
        .where(propias)
        .orderBy(
          desc(notificacionesAcademicas.createdAt),
          desc(notificacionesAcademicas.idNotificacion)
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select(totalesNotificaciones)
        .from(notificacionesAcademicas)
        .innerJoin(
          inscripcionesCursos,
          eq(
            notificacionesAcademicas.inscripcionId,
            inscripcionesCursos.idInscripcion
          )
        )
        .where(propias),
    ]);

    return responder({
      notifications: filas.map(aNotificacionDto),
      unreadCount: totales[0]?.noLeidas ?? 0,
      page,
      pageSize,
      total: totales[0]?.total ?? 0,
    });
  } catch (error) {
    console.error(
      "Error al consultar notificaciones:",
      error
    );

    return responder(
      {
        message:
          "No fue posible consultar las notificaciones",
      },
      500
    );
  }
}
