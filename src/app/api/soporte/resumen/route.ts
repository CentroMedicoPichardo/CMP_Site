import { NextResponse } from "next/server";
import {
  and,
  desc,
  eq,
  inArray,
  sql,
} from "drizzle-orm";
import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { preguntasUsuarios } from "@/lib/schema/index";
import type {
  EstadoPregunta,
  ResumenSoporteCliente,
} from "@/types/help";

const ESTADOS_ATENDIDOS: EstadoPregunta[] = [
  "respondida",
  "cerrada",
  "convertida_faq",
];

export async function GET() {
  const { session, error } = await requireApiAuth();

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const [resumen] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pendientes: sql<number>`count(*) FILTER (
          WHERE ${preguntasUsuarios.estado} = 'pendiente'
        )::int`,
        atendidas: sql<number>`count(*) FILTER (
          WHERE ${preguntasUsuarios.estado} IN (
            'respondida',
            'cerrada',
            'convertida_faq'
          )
        )::int`,
        cerradas: sql<number>`count(*) FILTER (
          WHERE ${preguntasUsuarios.estado} IN (
            'cerrada',
            'convertida_faq'
          )
        )::int`,
      })
      .from(preguntasUsuarios)
      .where(
        eq(
          preguntasUsuarios.idUsuario,
          session.user.id,
        ),
      );

    const [ultimaAtendida] = await db
      .select({
        idPregunta: preguntasUsuarios.idPregunta,
        titulo: preguntasUsuarios.titulo,
        estado: preguntasUsuarios.estado,
        updatedAt: preguntasUsuarios.updatedAt,
        createdAt: preguntasUsuarios.createdAt,
      })
      .from(preguntasUsuarios)
      .where(
        and(
          eq(
            preguntasUsuarios.idUsuario,
            session.user.id,
          ),
          inArray(
            preguntasUsuarios.estado,
            ESTADOS_ATENDIDOS,
          ),
        ),
      )
      .orderBy(
        desc(preguntasUsuarios.updatedAt),
        desc(preguntasUsuarios.createdAt),
      )
      .limit(1);

    const response: ResumenSoporteCliente = {
      total: resumen?.total ?? 0,
      pendientes: resumen?.pendientes ?? 0,
      atendidas: resumen?.atendidas ?? 0,
      cerradas: resumen?.cerradas ?? 0,
      ultimaAtendida: ultimaAtendida
        ? {
            ...ultimaAtendida,
            estado:
              (ultimaAtendida.estado ??
                "respondida") as EstadoPregunta,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (errorConsulta: unknown) {
    console.error(
      "Error obteniendo resumen de soporte del cliente:",
      errorConsulta,
    );

    return NextResponse.json(
      {
        error:
          "No fue posible cargar el resumen de tus preguntas.",
      },
      { status: 500 },
    );
  }
}
