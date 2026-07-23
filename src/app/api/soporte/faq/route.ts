import { NextRequest, NextResponse } from "next/server";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  type SQL,
} from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasFrecuentes,
  valoracionesFaq,
} from "@/lib/schema/index";
import { parseIdPositivo } from "@/lib/soporte/validaciones";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaTexto = searchParams.get("categoria");
    const busqueda = searchParams.get("busqueda")?.trim() ?? "";
    const categoria = categoriaTexto
      ? parseIdPositivo(categoriaTexto)
      : null;

    if (categoriaTexto && categoria === null) {
      return NextResponse.json(
        { error: "La categoría seleccionada no es válida." },
        { status: 400 },
      );
    }

    const condiciones: SQL[] = [
      eq(preguntasFrecuentes.activo, true),
      eq(categoriasAyuda.activo, true),
    ];

    if (categoria !== null) {
      condiciones.push(eq(preguntasFrecuentes.idCategoria, categoria));
    }

    if (busqueda) {
      const patron = `%${busqueda}%`;
      condiciones.push(
        or(
          ilike(preguntasFrecuentes.pregunta, patron),
          ilike(preguntasFrecuentes.respuesta, patron),
          ilike(categoriasAyuda.nombreCategoria, patron),
        )!,
      );
    }

    const faqs = await db
      .select({
        idPregunta: preguntasFrecuentes.idPregunta,
        idCategoria: preguntasFrecuentes.idCategoria,
        pregunta: preguntasFrecuentes.pregunta,
        respuesta: preguntasFrecuentes.respuesta,
        orden: preguntasFrecuentes.orden,
        vecesUtil: preguntasFrecuentes.vecesUtil,
        vecesNoUtil: preguntasFrecuentes.vecesNoUtil,
        activo: preguntasFrecuentes.activo,
        esDestacada: preguntasFrecuentes.esDestacada,
        tags: preguntasFrecuentes.tags,
        createdAt: preguntasFrecuentes.createdAt,
        updatedAt: preguntasFrecuentes.updatedAt,
        creadoPor: preguntasFrecuentes.creadoPor,
        categoria: {
          idCategoria: categoriasAyuda.idCategoria,
          nombreCategoria: categoriasAyuda.nombreCategoria,
          icono: categoriasAyuda.icono,
        },
      })
      .from(preguntasFrecuentes)
      .innerJoin(
        categoriasAyuda,
        eq(preguntasFrecuentes.idCategoria, categoriasAyuda.idCategoria),
      )
      .where(and(...condiciones))
      .orderBy(
        desc(preguntasFrecuentes.esDestacada),
        asc(preguntasFrecuentes.orden),
        asc(preguntasFrecuentes.pregunta),
      );

    const session = await auth();
    const ids = faqs.map((faq) => faq.idPregunta);
    const valoraciones =
      session?.user && ids.length > 0
        ? await db
            .select({
              idPreguntaFaq: valoracionesFaq.idPreguntaFaq,
              esUtil: valoracionesFaq.esUtil,
            })
            .from(valoracionesFaq)
            .where(
              and(
                eq(valoracionesFaq.idUsuario, session.user.id),
                inArray(valoracionesFaq.idPreguntaFaq, ids),
              ),
            )
        : [];

    const mapaValoraciones = new Map(
      valoraciones.map((item) => [item.idPreguntaFaq, item.esUtil]),
    );

    return NextResponse.json(
      faqs.map((faq) => ({
        ...faq,
        orden: faq.orden ?? 0,
        vecesUtil: faq.vecesUtil ?? 0,
        vecesNoUtil: faq.vecesNoUtil ?? 0,
        activo: faq.activo ?? true,
        esDestacada: faq.esDestacada ?? false,
        valoracionUsuario:
          mapaValoraciones.get(faq.idPregunta) ?? null,
      })),
    );
  } catch (error: unknown) {
    console.error("Error al obtener FAQ:", error);
    return NextResponse.json(
      { error: "No fue posible obtener las preguntas frecuentes." },
      { status: 500 },
    );
  }
}
