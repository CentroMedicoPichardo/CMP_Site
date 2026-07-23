import { NextRequest, NextResponse } from "next/server";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasUsuarios,
  usuarios,
} from "@/lib/schema/index";
import {
  esEstadoPregunta,
  esPrioridadPregunta,
  parseIdPositivo,
} from "@/lib/soporte/validaciones";
import type { OrdenPreguntasAdmin } from "@/types/help";

export async function GET(request: NextRequest) {
  const { session, error } = await requireApiRole("admin");

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
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda")?.trim() ?? "";
    const estado = searchParams.get("estado");
    const prioridad = searchParams.get("prioridad");
    const categoriaTexto = searchParams.get("categoria");
    const ordenTexto =
      searchParams.get("orden")?.trim() || "prioridad";

    const ordenesPermitidos: OrdenPreguntasAdmin[] = [
      "prioridad",
      "recientes",
      "antiguas",
      "actividad",
    ];

    if (
      !ordenesPermitidos.includes(
        ordenTexto as OrdenPreguntasAdmin,
      )
    ) {
      return NextResponse.json(
        { error: "El orden seleccionado no es válido." },
        { status: 400 },
      );
    }

    const orden = ordenTexto as OrdenPreguntasAdmin;

    const pagina = Math.max(
      Number.parseInt(searchParams.get("pagina") ?? "1", 10) || 1,
      1,
    );
    const limite = Math.min(
      Math.max(
        Number.parseInt(searchParams.get("limite") ?? "20", 10) || 20,
        5,
      ),
      100,
    );

    const condiciones: SQL[] = [];

    if (busqueda) {
      const patron = `%${busqueda}%`;
      condiciones.push(
        or(
          ilike(preguntasUsuarios.titulo, patron),
          ilike(preguntasUsuarios.descripcion, patron),
          ilike(usuarios.nombre, patron),
          ilike(usuarios.apellidoPaterno, patron),
          ilike(usuarios.correo, patron),
        )!,
      );
    }

    if (estado) {
      if (!esEstadoPregunta(estado)) {
        return NextResponse.json(
          { error: "El estado seleccionado no es válido." },
          { status: 400 },
        );
      }
      condiciones.push(eq(preguntasUsuarios.estado, estado));
    }

    if (prioridad) {
      if (!esPrioridadPregunta(prioridad)) {
        return NextResponse.json(
          { error: "La prioridad seleccionada no es válida." },
          { status: 400 },
        );
      }
      condiciones.push(eq(preguntasUsuarios.prioridad, prioridad));
    }

    if (categoriaTexto) {
      const categoria = parseIdPositivo(categoriaTexto);
      if (categoria === null) {
        return NextResponse.json(
          { error: "La categoría seleccionada no es válida." },
          { status: 400 },
        );
      }
      condiciones.push(eq(preguntasUsuarios.idCategoria, categoria));
    }

    const where =
      condiciones.length > 0 ? and(...condiciones) : undefined;

    const [{ total = 0 } = { total: 0 }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(preguntasUsuarios)
      .innerJoin(
        usuarios,
        eq(preguntasUsuarios.idUsuario, usuarios.id),
      )
      .where(where);

    const criteriosOrden = (() => {
      switch (orden) {
        case "recientes":
          return [desc(preguntasUsuarios.createdAt)];
        case "antiguas":
          return [asc(preguntasUsuarios.createdAt)];
        case "actividad":
          return [
            desc(preguntasUsuarios.updatedAt),
            desc(preguntasUsuarios.createdAt),
          ];
        case "prioridad":
        default:
          return [
            sql`CASE ${preguntasUsuarios.prioridad}
              WHEN 'urgente' THEN 1
              WHEN 'alta' THEN 2
              WHEN 'normal' THEN 3
              WHEN 'baja' THEN 4
              ELSE 5
            END`,
            desc(preguntasUsuarios.createdAt),
          ];
      }
    })();

    const preguntas = await db
      .select({
        idPregunta: preguntasUsuarios.idPregunta,
        idUsuario: preguntasUsuarios.idUsuario,
        idCategoria: preguntasUsuarios.idCategoria,
        titulo: preguntasUsuarios.titulo,
        descripcion: preguntasUsuarios.descripcion,
        estado: preguntasUsuarios.estado,
        prioridad: preguntasUsuarios.prioridad,
        esPrivada: preguntasUsuarios.esPrivada,
        idPreguntaFaq: preguntasUsuarios.idPreguntaFaq,
        createdAt: preguntasUsuarios.createdAt,
        updatedAt: preguntasUsuarios.updatedAt,
        usuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellidoPaterno: usuarios.apellidoPaterno,
          correo: usuarios.correo,
        },
        categoria: {
          idCategoria: categoriasAyuda.idCategoria,
          nombreCategoria: categoriasAyuda.nombreCategoria,
        },
      })
      .from(preguntasUsuarios)
      .innerJoin(
        usuarios,
        eq(preguntasUsuarios.idUsuario, usuarios.id),
      )
      .leftJoin(
        categoriasAyuda,
        eq(preguntasUsuarios.idCategoria, categoriasAyuda.idCategoria),
      )
      .where(where)
      .orderBy(...criteriosOrden)
      .limit(limite)
      .offset((pagina - 1) * limite);

    const [resumen] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pendientes: sql<number>`count(*) FILTER (WHERE ${preguntasUsuarios.estado} = 'pendiente')::int`,
        respondidas: sql<number>`count(*) FILTER (WHERE ${preguntasUsuarios.estado} = 'respondida')::int`,
        cerradas: sql<number>`count(*) FILTER (WHERE ${preguntasUsuarios.estado} IN ('cerrada', 'convertida_faq'))::int`,
        urgentes: sql<number>`count(*) FILTER (WHERE ${preguntasUsuarios.prioridad} = 'urgente' AND ${preguntasUsuarios.estado} = 'pendiente')::int`,
      })
      .from(preguntasUsuarios);

    return NextResponse.json({
      preguntas: preguntas.map((pregunta) => ({
        ...pregunta,
        estado: pregunta.estado ?? "pendiente",
        prioridad: pregunta.prioridad ?? "normal",
        esPrivada: pregunta.esPrivada ?? false,
      })),
      resumen: resumen ?? {
        total: 0,
        pendientes: 0,
        respondidas: 0,
        cerradas: 0,
        urgentes: 0,
      },
      orden,
      paginacion: {
        pagina,
        limite,
        total,
        totalPaginas: Math.max(Math.ceil(total / limite), 1),
      },
    });
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener bandeja de soporte:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible cargar la bandeja de soporte." },
      { status: 500 },
    );
  }
}
