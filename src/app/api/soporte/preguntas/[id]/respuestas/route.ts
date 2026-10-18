
import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { normalizeRole, requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  preguntasUsuarios,
  respuestasAyuda,
  usuarios,
} from "@/lib/schema/index";

import {
  parseIdPositivo,
  validarContenidoRespuesta,
} from "@/lib/soporte/validaciones";

const TITULO_SOLICITUD_ARCO =
  "Solicitud ARCO - Eliminacion de cuenta";

class ErrorSoporte extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ErrorSoporte";
  }
}

async function obtenerPregunta(idPregunta: number) {
  const [pregunta] = await db
    .select({
      idPregunta: preguntasUsuarios.idPregunta,
      idUsuario: preguntasUsuarios.idUsuario,
      estado: preguntasUsuarios.estado,
    })
    .from(preguntasUsuarios)
    .where(eq(preguntasUsuarios.idPregunta, idPregunta))
    .limit(1);

  return pregunta ?? null;
}

/**
 * Consultar respuestas.
 *
 * Conserva las comprobaciones de
 * autorización existentes.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiAuth();

  if (error) return error;

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const idPregunta = parseIdPositivo(id);

    if (idPregunta === null) {
      return NextResponse.json(
        { error: "Identificador de pregunta inválido." },
        { status: 400 }
      );
    }

    const pregunta = await obtenerPregunta(idPregunta);

    if (!pregunta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 }
      );
    }

    const esAdmin =
      normalizeRole(session.user.rol) === "admin";

    const esDueno =
      pregunta.idUsuario === session.user.id;

    if (!esAdmin && !esDueno) {
      return NextResponse.json(
        {
          error:
            "No tienes permiso para consultar esta conversación.",
        },
        { status: 403 }
      );
    }

    const respuestas = await db
      .select({
        idRespuesta: respuestasAyuda.idRespuesta,
        idPregunta: respuestasAyuda.idPregunta,
        idUsuario: respuestasAyuda.idUsuario,
        contenido: respuestasAyuda.contenido,
        esRespuestaAdmin: respuestasAyuda.esRespuestaAdmin,
        esSolucion: respuestasAyuda.esSolucion,
        createdAt: respuestasAyuda.createdAt,
        usuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellidoPaterno: usuarios.apellidoPaterno,
        },
      })
      .from(respuestasAyuda)
      .innerJoin(
        usuarios,
        eq(respuestasAyuda.idUsuario, usuarios.id)
      )
      .where(eq(respuestasAyuda.idPregunta, idPregunta))
      .orderBy(asc(respuestasAyuda.createdAt));

    return NextResponse.json(
      respuestas.map((respuesta) => ({
        ...respuesta,
        esRespuestaAdmin:
          respuesta.esRespuestaAdmin ?? false,
        esSolucion: respuesta.esSolucion ?? false,
      }))
    );
  } catch (errorConsulta) {
    console.error(
      "Error al consultar respuestas:",
      errorConsulta
    );

    return NextResponse.json(
      { error: "No fue posible obtener las respuestas." },
      { status: 500 }
    );
  }
}

/**
 * Crear respuestas de soporte.
 *
 * A17:
 * Las solicitudes de eliminación
 * no pueden responderse mediante
 * el flujo habitual de Soporte.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiAuth();

  if (error) return error;

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const idPregunta = parseIdPositivo(id);

    if (idPregunta === null) {
      return NextResponse.json(
        { error: "Identificador de pregunta inválido." },
        { status: 400 }
      );
    }

    const payload: unknown =
      await request.json().catch(() => null);

    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return NextResponse.json(
        { error: "Formato de respuesta inválido." },
        { status: 400 }
      );
    }

    const body = payload as Record<string, unknown>;

    const contenido = body.contenido;

    if (typeof contenido !== "string") {
      return NextResponse.json(
        { error: "El contenido debe ser texto." },
        { status: 400 }
      );
    }

    const errorContenido =
      validarContenidoRespuesta(contenido);

    if (errorContenido) {
      return NextResponse.json(
        { error: errorContenido },
        { status: 400 }
      );
    }

    const esAdmin =
      normalizeRole(session.user.rol) === "admin";

    /*
     * Bloqueamos la fila durante
     * la transacción para comprobar
     * el tipo y estado de la solicitud
     * antes de modificar registros.
     */
    const respuesta = await db.transaction(
      async (tx) => {
        const [pregunta] = await tx
          .select({
            idPregunta: preguntasUsuarios.idPregunta,
            idUsuario: preguntasUsuarios.idUsuario,
            estado: preguntasUsuarios.estado,
            titulo: preguntasUsuarios.titulo,
          })
          .from(preguntasUsuarios)
          .where(
            eq(preguntasUsuarios.idPregunta, idPregunta)
          )
          .limit(1)
          .for("update");

        if (!pregunta) {
          throw new ErrorSoporte(
            "Pregunta no encontrada.",
            404
          );
        }

        const esDueno =
          pregunta.idUsuario === session.user.id;

        if (!esAdmin && !esDueno) {
          throw new ErrorSoporte(
            "No tienes permiso para responder esta pregunta.",
            403
          );
        }

        /*
         * Protección ARCO.
         * No se insertan respuestas ni
         * se cambian estados.
         */
        if (
          pregunta.titulo === TITULO_SOLICITUD_ARCO
        ) {
          throw new ErrorSoporte(
            "Esta solicitud de eliminación debe atenderse desde el módulo ARCO.",
            409
          );
        }

        if (
          pregunta.estado === "convertida_faq" ||
          (!esAdmin && pregunta.estado === "cerrada")
        ) {
          throw new ErrorSoporte(
            "Esta conversación ya no admite mensajes.",
            409
          );
        }

        const esSolucion =
          esAdmin && body.esSolucion === true;

        if (esSolucion) {
          await tx
            .update(respuestasAyuda)
            .set({ esSolucion: false })
            .where(
              eq(respuestasAyuda.idPregunta, idPregunta)
            );
        }

        const [creada] = await tx
          .insert(respuestasAyuda)
          .values({
            idPregunta,
            idUsuario: session.user.id,
            contenido: contenido.trim(),
            esRespuestaAdmin: esAdmin,
            esSolucion,
          })
          .returning();

        await tx
          .update(preguntasUsuarios)
          .set({
            estado: esAdmin ? "respondida" : "pendiente",
            updatedAt: new Date().toISOString(),
          })
          .where(
            eq(preguntasUsuarios.idPregunta, idPregunta)
          );

        return creada;
      }
    );

    return NextResponse.json(
      respuesta,
      { status: 201 }
    );
  } catch (errorCreacion) {
    if (errorCreacion instanceof ErrorSoporte) {
      return NextResponse.json(
        { error: errorCreacion.message },
        { status: errorCreacion.status }
      );
    }

    console.error(
      "Error al crear respuesta:",
      errorCreacion
    );

    return NextResponse.json(
      { error: "No fue posible enviar la respuesta." },
      { status: 500 }
    );
  }
}
