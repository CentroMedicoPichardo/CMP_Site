// src/app/api/instructores/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instructores } from "@/lib/schema/index";
import { and, eq, sql } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

function validarId(id: string) {
  const idNum = Number(id);
  return Number.isInteger(idNum) && idNum > 0 ? idNum : null;
}

function normalizarTexto(valor: unknown, maxLength = 255) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function normalizarEdad(valor: unknown) {
  const edad = Number(valor);

  if (!Number.isInteger(edad) || edad <= 0 || edad > 120) {
    return null;
  }

  return edad;
}

function normalizarBooleano(valor: unknown, defaultValue = true) {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (valor === "true") {
    return true;
  }

  if (valor === "false") {
    return false;
  }

  return defaultValue;
}

function correoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idInstructor = validarId(id);

    if (!idInstructor) {
      return NextResponse.json(
        { error: "ID de instructor inválido" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const condicion = isAdmin
      ? eq(instructores.idInstructor, idInstructor)
      : and(
          eq(instructores.idInstructor, idInstructor),
          eq(instructores.activo, true)
        );

    const instructor = await db
      .select({
        idInstructor: instructores.idInstructor,
        nombre: instructores.nombre,
        apellidoPaterno: instructores.apellidoPaterno,
        apellidoMaterno: instructores.apellidoMaterno,
        especialidad: instructores.especialidad,
        edad: instructores.edad,
        telefono: instructores.telefono,
        correo: instructores.correo,
        direccion: instructores.direccion,
        activo: instructores.activo,
      })
      .from(instructores)
      .where(condicion)
      .limit(1);

    if (!instructor.length) {
      return NextResponse.json(
        { error: "Instructor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor[0]);
  } catch (error) {
    console.error("Error en GET instructor:", error);

    return NextResponse.json(
      { error: "Error al obtener instructor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idInstructor = validarId(id);

    if (!idInstructor) {
      return NextResponse.json(
        { error: "ID de instructor inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const nombre = normalizarTexto(body.nombre, 100);
    const apellidoPaterno = normalizarTexto(body.apellidoPaterno, 100);
    const apellidoMaterno =
      normalizarTexto(body.apellidoMaterno, 100) || null;
    const especialidad = normalizarTexto(body.especialidad, 150);
    const edad = normalizarEdad(body.edad);
    const telefono = normalizarTexto(body.telefono, 30) || null;
    const correo = normalizarTexto(body.correo, 150).toLowerCase();
    const direccion = normalizarTexto(body.direccion, 300) || null;
    const activo = normalizarBooleano(body.activo, true);

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre del instructor es requerido" },
        { status: 400 }
      );
    }

    if (!apellidoPaterno) {
      return NextResponse.json(
        { error: "El apellido paterno es requerido" },
        { status: 400 }
      );
    }

    if (!especialidad) {
      return NextResponse.json(
        { error: "La especialidad es requerida" },
        { status: 400 }
      );
    }

    if (!edad) {
      return NextResponse.json(
        { error: "La edad es requerida y debe ser válida" },
        { status: 400 }
      );
    }

    if (!correo || !correoValido(correo)) {
      return NextResponse.json(
        { error: "El correo es requerido y debe ser válido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(instructores)
        .set({
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          especialidad,
          edad,
          telefono,
          correo,
          direccion,
          activo,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(instructores.idInstructor, idInstructor))
        .returning({
          idInstructor: instructores.idInstructor,
          nombre: instructores.nombre,
          apellidoPaterno: instructores.apellidoPaterno,
          apellidoMaterno: instructores.apellidoMaterno,
          especialidad: instructores.especialidad,
          edad: instructores.edad,
          telefono: instructores.telefono,
          correo: instructores.correo,
          direccion: instructores.direccion,
          activo: instructores.activo,
        });
    });

    if (!actualizado.length) {
      return NextResponse.json(
        { error: "Instructor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizado[0]);
  } catch (error) {
    console.error("Error en PUT instructor:", error);

    return NextResponse.json(
      { error: "Error al actualizar instructor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idInstructor = validarId(id);

    if (!idInstructor) {
      return NextResponse.json(
        { error: "ID de instructor inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(instructores)
        .set({
          activo: false,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(instructores.idInstructor, idInstructor))
        .returning({
          idInstructor: instructores.idInstructor,
          nombre: instructores.nombre,
          apellidoPaterno: instructores.apellidoPaterno,
          especialidad: instructores.especialidad,
          activo: instructores.activo,
        });
    });

    if (!ocultado.length) {
      return NextResponse.json(
        { error: "Instructor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Instructor ocultado correctamente",
      instructor: ocultado[0],
    });
  } catch (error) {
    console.error("Error en DELETE instructor:", error);

    return NextResponse.json(
      { error: "Error al ocultar instructor" },
      { status: 500 }
    );
  }
}