
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { requireApiAuth } from "@/lib/auth";

const camposPerfil = {
  id: usuarios.id,
  nombre: usuarios.nombre,
  apellidoPaterno: usuarios.apellidoPaterno,
  apellidoMaterno: usuarios.apellidoMaterno,
  edad: usuarios.edad,
  sexo: usuarios.sexo,
  telefono: usuarios.telefono,
  correo: usuarios.correo,
};

const CAMPOS_EDITABLES = new Set([
  "nombre",
  "apellidoPaterno",
  "apellidoMaterno",
  "edad",
  "sexo",
  "telefono",
]);

const SEXOS_VALIDOS = new Set([
  "masculino",
  "femenino",
  "otro",
]);

type CambiosPerfil = Partial<
  Pick<
    typeof usuarios.$inferInsert,
    | "nombre"
    | "apellidoPaterno"
    | "apellidoMaterno"
    | "edad"
    | "sexo"
    | "telefono"
  >
>;

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

// Derecho de ACCESO.
// Devuelve solamente los datos personales
// del usuario autenticado.
export async function GET() {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  try {
    const resultados = await db
      .select(camposPerfil)
      .from(usuarios)
      .where(
        and(
          eq(usuarios.id, session.user.id),
          eq(usuarios.activo, true)
        )
      )
      .limit(1);

    if (!resultados[0]) {
      return responder(
        { message: "Perfil no encontrado" },
        404
      );
    }

    return responder({
      profile: resultados[0],
    });
  } catch (error) {
    console.error(
      "Error al consultar perfil:",
      error
    );

    return responder(
      { message: "No fue posible consultar el perfil" },
      500
    );
  }
}

// Derecho de RECTIFICACIÓN.
// Actualiza exclusivamente los datos
// autorizados de la cuenta autenticada.
export async function PUT(
  request: Request
) {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  const payload: unknown =
    await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return responder(
      { message: "Datos inválidos" },
      400
    );
  }

  const body =
    payload as Record<string, unknown>;

  const claves = Object.keys(body);

  if (
    claves.length === 0 ||
    claves.some(
      (clave) => !CAMPOS_EDITABLES.has(clave)
    )
  ) {
    return responder(
      {
        message:
          "La solicitud contiene campos no permitidos",
      },
      400
    );
  }

  const cambios: CambiosPerfil = {};

  for (const campo of [
    "nombre",
    "apellidoPaterno",
  ] as const) {
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        campo
      )
    ) {
      const valor = body[campo];

      if (
        typeof valor !== "string" ||
        valor.trim().length < 1 ||
        valor.trim().length > 100
      ) {
        return responder(
          {
            message:
              `El campo ${campo} no es válido`,
          },
          400
        );
      }

      cambios[campo] = valor.trim();
    }
  }

  if ("apellidoMaterno" in body) {
    const valor = body.apellidoMaterno;

    if (
      valor !== null &&
      typeof valor !== "string"
    ) {
      return responder(
        { message: "Apellido materno inválido" },
        400
      );
    }

    if (
      typeof valor === "string" &&
      valor.trim().length > 100
    ) {
      return responder(
        { message: "Apellido materno demasiado largo" },
        400
      );
    }

    cambios.apellidoMaterno =
      typeof valor === "string"
        ? valor.trim() || null
        : null;
  }

  if ("edad" in body) {
    const edad = body.edad;

    if (
      typeof edad !== "number" ||
      !Number.isInteger(edad) ||
      edad < 1 ||
      edad > 120
    ) {
      return responder(
        { message: "Edad inválida" },
        400
      );
    }

    cambios.edad = edad;
  }

  if ("sexo" in body) {
    const sexo = body.sexo;

    if (
      typeof sexo !== "string" ||
      !SEXOS_VALIDOS.has(sexo)
    ) {
      return responder(
        { message: "Sexo inválido" },
        400
      );
    }

    cambios.sexo = sexo;
  }

  if ("telefono" in body) {
    const telefono = body.telefono;

    if (
      typeof telefono !== "string" ||
      !/^\d{10}$/.test(telefono)
    ) {
      return responder(
        {
          message:
            "El teléfono debe contener 10 dígitos",
        },
        400
      );
    }

    cambios.telefono = telefono;
  }

  try {
    const actualizados = await db
      .update(usuarios)
      .set(cambios)
      .where(
        and(
          eq(usuarios.id, session.user.id),
          eq(usuarios.activo, true)
        )
      )
      .returning(camposPerfil);

    if (!actualizados[0]) {
      return responder(
        { message: "Perfil no encontrado" },
        404
      );
    }

    return responder({
      message: "Perfil actualizado correctamente",
      profile: actualizados[0],
    });
  } catch (error) {
    console.error(
      "Error al rectificar perfil:",
      error
    );

    return responder(
      { message: "No fue posible actualizar el perfil" },
      500
    );
  }
}
