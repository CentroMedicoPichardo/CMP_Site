// src/app/api/instructores/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instructores } from "@/lib/schema/index";
import { desc, eq, and, type SQL } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

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

function correoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const isAdmin = searchParams.get("admin") === "true";
    const especialidad = normalizarTexto(
      searchParams.get("especialidad"),
      150
    );

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const filtros: SQL[] = [];

    if (!isAdmin) {
      filtros.push(eq(instructores.activo, true));
    }

    if (especialidad) {
      filtros.push(eq(instructores.especialidad, especialidad));
    }

    const data = await db
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
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(instructores.idInstructor));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET instructores:", error);

    return NextResponse.json(
      { error: "Error al obtener instructores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
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

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db
        .insert(instructores)
        .values({
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          especialidad,
          edad,
          telefono,
          correo,
          direccion,
          activo: true,
        })
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

    if (!nuevo.length || !nuevo[0]) {
      return NextResponse.json(
        { error: "Error al crear instructor" },
        { status: 500 }
      );
    }

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST instructor:", error);

    return NextResponse.json(
      { error: "Error al crear instructor" },
      { status: 500 }
    );
  }
}