import { NextRequest, NextResponse } from "next/server";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasFrecuentes,
  usuarios,
} from "@/lib/schema/index";
import {
  normalizarTags,
  parseEnteroNoNegativo,
  parseIdPositivo,
  validarPreguntaFaq,
  validarRespuestaFaq,
} from "@/lib/soporte/validaciones";
import type { CrearFaqDTO } from "@/types/help";

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
    const categoriaTexto = searchParams.get("categoria");
    const estado = searchParams.get("estado");
    const condiciones: SQL[] = [];

    if (busqueda) {
      const patron = `%${busqueda}%`;
      condiciones.push(
        or(
          ilike(preguntasFrecuentes.pregunta, patron),
          ilike(preguntasFrecuentes.respuesta, patron),
        )!,
      );
    }

    if (categoriaTexto) {
      const idCategoria = parseIdPositivo(categoriaTexto);
      if (idCategoria === null) {
        return NextResponse.json(
          { error: "La categoría seleccionada no es válida." },
          { status: 400 },
        );
      }
      condiciones.push(eq(preguntasFrecuentes.idCategoria, idCategoria));
    }

    if (estado === "activas") {
      condiciones.push(eq(preguntasFrecuentes.activo, true));
    } else if (estado === "inactivas") {
      condiciones.push(eq(preguntasFrecuentes.activo, false));
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
        creador: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellidoPaterno: usuarios.apellidoPaterno,
          correo: usuarios.correo,
        },
      })
      .from(preguntasFrecuentes)
      .innerJoin(
        categoriasAyuda,
        eq(preguntasFrecuentes.idCategoria, categoriasAyuda.idCategoria),
      )
      .leftJoin(
        usuarios,
        eq(preguntasFrecuentes.creadoPor, usuarios.id),
      )
      .where(
        condiciones.length > 0 ? and(...condiciones) : undefined,
      )
      .orderBy(
        desc(preguntasFrecuentes.esDestacada),
        asc(preguntasFrecuentes.orden),
        asc(preguntasFrecuentes.pregunta),
      );

    return NextResponse.json(
      faqs.map((faq) => ({
        ...faq,
        orden: faq.orden ?? 0,
        vecesUtil: faq.vecesUtil ?? 0,
        vecesNoUtil: faq.vecesNoUtil ?? 0,
        activo: faq.activo ?? true,
        esDestacada: faq.esDestacada ?? false,
      })),
    );
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener FAQs admin:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible obtener las preguntas frecuentes." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = (await request.json()) as CrearFaqDTO;
    const idCategoria = parseIdPositivo(body.idCategoria);
    const errorPregunta = validarPreguntaFaq(body.pregunta);
    const errorRespuesta = validarRespuestaFaq(body.respuesta);

    if (idCategoria === null || errorPregunta || errorRespuesta) {
      return NextResponse.json(
        {
          error:
            idCategoria === null
              ? "Selecciona una categoría válida."
              : errorPregunta ?? errorRespuesta,
        },
        { status: 400 },
      );
    }

    const [categoria] = await db
      .select({ idCategoria: categoriasAyuda.idCategoria })
      .from(categoriasAyuda)
      .where(eq(categoriasAyuda.idCategoria, idCategoria))
      .limit(1);

    if (!categoria) {
      return NextResponse.json(
        { error: "La categoría seleccionada no existe." },
        { status: 400 },
      );
    }

    const [creada] = await db
      .insert(preguntasFrecuentes)
      .values({
        idCategoria,
        pregunta: body.pregunta.trim(),
        respuesta: body.respuesta.trim(),
        orden: parseEnteroNoNegativo(body.orden, 0),
        activo: body.activo ?? true,
        esDestacada: body.esDestacada ?? false,
        tags: normalizarTags(body.tags),
        creadoPor: session.user.id,
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(creada, { status: 201 });
  } catch (errorCreacion: unknown) {
    console.error("Error al crear FAQ:", errorCreacion);
    return NextResponse.json(
      { error: "No fue posible crear la pregunta frecuente." },
      { status: 500 },
    );
  }
}
