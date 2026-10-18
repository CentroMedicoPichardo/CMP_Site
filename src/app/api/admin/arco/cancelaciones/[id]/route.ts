
import { NextResponse } from "next/server";
import {
  and,
  eq,
  or,
  sql,
} from "drizzle-orm";

import {
  requireApiRole,
} from "@/lib/auth";

import {
  db,
} from "@/lib/db";

import {
  comprasCursos,
  compraParticipantes,
  inscripcionesCursos,
  pagosCursos,
  participantes,
  preguntasUsuarios,
  usuarios,
} from "@/lib/schema";

import {
  parseIdPositivo,
} from "@/lib/soporte/validaciones";

const TITULO_SOLICITUD =
  "Solicitud ARCO - Eliminacion de cuenta";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
 * A17 - Derecho de Cancelación.
 *
 * Detalle administrativo de una
 * solicitud de eliminación de cuenta.
 *
 * Este endpoint:
 *
 * - Requiere rol administrador.
 * - Verifica que sea una solicitud ARCO.
 * - Consulta datos básicos de la cuenta.
 * - Cuenta registros relacionados.
 * - No modifica ni elimina información.
 */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  const {
    session,
    error,
  } = await requireApiRole("admin");

  if (!session) {
    return error ?? responder(
      {
        message:
          "No tienes autorización",
      },
      403
    );
  }

  const { id } = await context.params;

  const solicitudId =
    parseIdPositivo(id);

  if (solicitudId === null) {
    return responder(
      {
        message:
          "El identificador de la solicitud no es válido",
      },
      400
    );
  }

  try {
    /*
     * Localizar exclusivamente una
     * solicitud de Cancelación ARCO.
     *
     * Una pregunta normal de Soporte
     * no debe poder consultarse como
     * solicitud de eliminación.
     */
    const [solicitud] = await db
      .select({
        solicitudId:
          preguntasUsuarios.idPregunta,

        usuarioId:
          preguntasUsuarios.idUsuario,

        titulo:
          preguntasUsuarios.titulo,

        descripcion:
          preguntasUsuarios.descripcion,

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

          apellidoMaterno:
            usuarios.apellidoMaterno,

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
      .where(
        and(
          eq(
            preguntasUsuarios.idPregunta,
            solicitudId
          ),
          eq(
            preguntasUsuarios.titulo,
            TITULO_SOLICITUD
          )
        )
      )
      .limit(1);

    if (!solicitud) {
      return responder(
        {
          message:
            "Solicitud de eliminación no encontrada",
        },
        404
      );
    }

    const usuarioId =
      solicitud.usuarioId;

    /*
     * Consultar dependencias sin
     * modificar ninguna tabla.
     *
     * Los conteos se realizan de
     * forma separada para evitar
     * multiplicar registros mediante
     * combinaciones de joins.
     */
    const [
      resultadoCompras,
      resultadoPagos,
      resultadoInscripciones,
      resultadoParticipantes,
      resultadoSoporte,
    ] = await Promise.all([
      /*
       * Compras realizadas por
       * la cuenta solicitante.
       */
      db
        .select({
          total: sql<number>`
            COUNT(*)::int
          `,
        })
        .from(comprasCursos)
        .where(
          eq(
            comprasCursos.idusuario,
            usuarioId
          )
        ),

      /*
       * Pagos asociados a las
       * compras del usuario.
       */
      db
        .select({
          total: sql<number>`
            COUNT(DISTINCT
              ${pagosCursos.idPago}
            )::int
          `,
        })
        .from(pagosCursos)
        .innerJoin(
          comprasCursos,
          eq(
            pagosCursos.idCompra,
            comprasCursos.idcompra
          )
        )
        .where(
          eq(
            comprasCursos.idusuario,
            usuarioId
          )
        ),

      /*
       * Inscripciones relacionadas
       * directamente con el usuario
       * o derivadas de sus compras.
       *
       * Se usa DISTINCT porque una
       * inscripción puede aparecer
       * por ambas relaciones.
       */
      db
        .select({
          total: sql<number>`
            COUNT(DISTINCT
              ${inscripcionesCursos.idInscripcion}
            )::int
          `,
        })
        .from(inscripcionesCursos)
        .leftJoin(
          compraParticipantes,
          eq(
            inscripcionesCursos.compraParticipanteId,
            compraParticipantes.idCompraParticipante
          )
        )
        .leftJoin(
          comprasCursos,
          eq(
            compraParticipantes.idCompra,
            comprasCursos.idcompra
          )
        )
        .where(
          or(
            eq(
              inscripcionesCursos.usuarioId,
              usuarioId
            ),
            eq(
              comprasCursos.idusuario,
              usuarioId
            )
          )
        ),

      /*
       * Participantes relacionados
       * con la cuenta o registrados
       * mediante sus compras.
       */
      db
        .select({
          total: sql<number>`
            COUNT(DISTINCT
              ${participantes.idParticipante}
            )::int
          `,
        })
        .from(participantes)
        .leftJoin(
          compraParticipantes,
          eq(
            participantes.idParticipante,
            compraParticipantes.idParticipante
          )
        )
        .leftJoin(
          comprasCursos,
          eq(
            compraParticipantes.idCompra,
            comprasCursos.idcompra
          )
        )
        .where(
          or(
            eq(
              participantes.usuarioId,
              usuarioId
            ),
            eq(
              comprasCursos.idusuario,
              usuarioId
            )
          )
        ),

      /*
       * Registros de Soporte.
       *
       * Incluye la propia solicitud
       * de eliminación.
       */
      db
        .select({
          total: sql<number>`
            COUNT(*)::int
          `,
        })
        .from(preguntasUsuarios)
        .where(
          eq(
            preguntasUsuarios.idUsuario,
            usuarioId
          )
        ),
    ]);

    const dependencias = {
      compras:
        resultadoCompras[0]?.total ?? 0,

      pagos:
        resultadoPagos[0]?.total ?? 0,

      inscripciones:
        resultadoInscripciones[0]?.total ?? 0,

      participantes:
        resultadoParticipantes[0]?.total ?? 0,

      solicitudesSoporte:
        resultadoSoporte[0]?.total ?? 0,
    };

    /*
     * Este diagnóstico NO autoriza
     * la eliminación automática.
     *
     * Todavía deben revisarse
     * las relaciones restantes,
     * comprobantes, documentación,
     * requisitos académicos y
     * reglas de conservación.
     */
    return responder({
      solicitud,

      dependencias,

      revision: {
        requiereRevisionAdministrativa:
          true,

        eliminacionEjecutada:
          false,

        autorizaEliminacionAutomatica:
          false,

        mensaje:
          "La consulta muestra un resumen " +
          "de registros relacionados. " +
          "No realiza ni autoriza la " +
          "eliminación de la cuenta. " +
          "Se requiere revisar todas " +
          "las dependencias y la política " +
          "de conservación antes de " +
          "procesar la cancelación.",
      },
    });
  } catch (errorConsulta) {
    console.error(
      "Error consultando detalle ARCO:",
      errorConsulta
    );

    return responder(
      {
        message:
          "No fue posible consultar el detalle de la solicitud",
      },
      500
    );
  }
}
