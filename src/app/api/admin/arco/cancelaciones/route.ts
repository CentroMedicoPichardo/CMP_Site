
import { NextResponse } from "next/server";
import {
  and,
  desc,
  eq,
  sql,
} from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  preguntasUsuarios,
  usuarios,
} from "@/lib/schema";

const TITULO_SOLICITUD =
  "Solicitud ARCO - Eliminacion de cuenta";

const LIMITE_POR_PAGINA = 20;

const ESTADOS_VALIDOS = new Set([
  "pendiente",
  "respondida",
  "cerrada",
  "convertida_faq",
]);

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
 * A17 - Administración ARCO.
 *
 * Consulta las solicitudes de
 * eliminación de cuentas.
 *
 * Solo los administradores pueden
 * acceder a esta información.
 *
 * Este endpoint es de solo lectura:
 * no elimina usuarios ni modifica
 * el estado de las solicitudes.
 */
export async function GET(
  request: Request
) {
  const { session, error } =
    await requireApiRole("admin");

  if (!session) {
    return error ?? responder(
      {
        message:
          "No tienes autorización",
      },
      403
    );
  }

  const url = new URL(request.url);

  const paginaParametro =
    url.searchParams.get("pagina");

  const pagina = Number(
    paginaParametro ?? "1"
  );

  if (
    !Number.isSafeInteger(pagina) ||
    pagina < 1 ||
    pagina > 100000
  ) {
    return responder(
      {
        message:
          "El número de página no es válido",
      },
      400
    );
  }

  const estado =
    url.searchParams.get("estado");

  if (
    estado &&
    !ESTADOS_VALIDOS.has(estado)
  ) {
    return responder(
      {
        message:
          "El estado solicitado no es válido",
      },
      400
    );
  }

  try {
    const filtroBase =
      eq(
        preguntasUsuarios.titulo,
        TITULO_SOLICITUD
      );

    const filtroListado = estado
      ? and(
          filtroBase,
          eq(
            preguntasUsuarios.estado,
            estado
          )
        )
      : filtroBase;

    /*
     * Solo se consultan los campos
     * necesarios para la bandeja.
     *
     * Nunca se envían contraseñas,
     * tokens ni información sensible
     * de autenticación.
     */
    const solicitudes = await db
      .select({
        solicitudId:
          preguntasUsuarios.idPregunta,

        usuarioId:
          preguntasUsuarios.idUsuario,

        titulo:
          preguntasUsuarios.titulo,

        estado:
          preguntasUsuarios.estado,

        prioridad:
          preguntasUsuarios.prioridad,

        esPrivada:
          preguntasUsuarios.esPrivada,

        fechaSolicitud:
          preguntasUsuarios.createdAt,

        fechaActualizacion:
          preguntasUsuarios.updatedAt,

        usuario: {
          id:
            usuarios.id,

          nombre:
            usuarios.nombre,

          apellidoPaterno:
            usuarios.apellidoPaterno,

          correo:
            usuarios.correo,

          activo:
            usuarios.activo,
        },
      })
      .from(preguntasUsuarios)
      .leftJoin(
        usuarios,
        eq(
          preguntasUsuarios.idUsuario,
          usuarios.id
        )
      )
      .where(filtroListado)
      .orderBy(
        desc(
          preguntasUsuarios.idPregunta
        )
      )
      .limit(LIMITE_POR_PAGINA)
      .offset(
        (pagina - 1) *
          LIMITE_POR_PAGINA
      );

    /*
     * Contamos los registros que
     * coinciden con el filtro.
     */
    const [conteo] = await db
      .select({
        total: sql<number>`
          COUNT(*)::int
        `,
      })
      .from(preguntasUsuarios)
      .where(filtroListado);

    /*
     * Resumen general de todas las
     * solicitudes de Cancelación.
     *
     * Importante:
     * "cerrada" es un estado de
     * Soporte y no demuestra que
     * los datos hayan sido eliminados.
     */
    const [resumen] = await db
      .select({
        total: sql<number>`
          COUNT(*)::int
        `,

        pendientes: sql<number>`
          COUNT(*) FILTER (
            WHERE
              ${preguntasUsuarios.estado}
              = 'pendiente'
          )::int
        `,

        respondidas: sql<number>`
          COUNT(*) FILTER (
            WHERE
              ${preguntasUsuarios.estado}
              = 'respondida'
          )::int
        `,

        cerradas: sql<number>`
          COUNT(*) FILTER (
            WHERE
              ${preguntasUsuarios.estado}
              = 'cerrada'
          )::int
        `,
      })
      .from(preguntasUsuarios)
      .where(filtroBase);

    const total =
      conteo?.total ?? 0;

    return responder({
      solicitudes,

      resumen: resumen ?? {
        total: 0,
        pendientes: 0,
        respondidas: 0,
        cerradas: 0,
      },

      paginacion: {
        pagina,
        limite: LIMITE_POR_PAGINA,
        total,
        totalPaginas:
          Math.max(
            1,
            Math.ceil(
              total / LIMITE_POR_PAGINA
            )
          ),
      },
    });
  } catch (errorConsulta) {
    console.error(
      "Error al consultar solicitudes ARCO:",
      errorConsulta
    );

    return responder(
      {
        message:
          "No fue posible consultar las solicitudes de eliminación",
      },
      500
    );
  }
}
