// src/app/api/cursos/verificar-inscripcion/route.ts

import { NextResponse } from "next/server";
import {
  and,
  asc,
  eq,
  inArray,
} from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inscripcionesCursos } from "@/lib/schema";
import { parsePositiveInteger } from "@/lib/validators/common";

interface InscripcionResumen {
  idInscripcion: number;
  estado: string | null;
  participanteId: number | null;
  compraParticipanteId: number | null;
}

interface VerificarInscripcionResponse {
  autenticado: boolean;
  inscrito: boolean;
  cantidadInscripciones: number;
  inscripcionId: number | null;
  inscripciones: InscripcionResumen[];
}

const ESTADOS_VIGENTES = [
  "activo",
  "Activo",
  "confirmada",
  "Confirmada",
] as const;

function respuestaSinInscripcion(
  autenticado: boolean
): VerificarInscripcionResponse {
  return {
    autenticado,
    inscrito: false,
    cantidadInscripciones: 0,
    inscripcionId: null,
    inscripciones: [],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const cursoId = parsePositiveInteger(
      searchParams.get("cursoId")
    );

    if (!cursoId) {
      return NextResponse.json(
        {
          error:
            "El parámetro cursoId es requerido y debe ser un entero positivo",
        },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        respuestaSinInscripcion(false),
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const usuarioId = Number(session.user.id);

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

    const inscripciones = await db
      .select({
        idInscripcion:
          inscripcionesCursos.idInscripcion,
        estado: inscripcionesCursos.estado,
        participanteId:
          inscripcionesCursos.participanteId,
        compraParticipanteId:
          inscripcionesCursos.compraParticipanteId,
      })
      .from(inscripcionesCursos)
      .where(
        and(
          eq(
            inscripcionesCursos.cursoId,
            cursoId
          ),
          eq(
            inscripcionesCursos.usuarioId,
            usuarioId
          ),
          inArray(
            inscripcionesCursos.estado,
            [...ESTADOS_VIGENTES]
          )
        )
      )
      .orderBy(
        asc(inscripcionesCursos.idInscripcion)
      );

    return NextResponse.json(
      {
        autenticado: true,
        inscrito: inscripciones.length > 0,
        cantidadInscripciones:
          inscripciones.length,
        inscripcionId:
          inscripciones[0]?.idInscripcion ??
          null,
        inscripciones,
      } satisfies VerificarInscripcionResponse,
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Error verificando inscripción:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al verificar la inscripción",
        autenticado: false,
        inscrito: false,
        cantidadInscripciones: 0,
        inscripcionId: null,
        inscripciones: [],
      },
      { status: 500 }
    );
  }
}