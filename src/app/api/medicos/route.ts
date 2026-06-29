// src/app/api/medicos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicos } from "@/lib/schema/index";
import { asc, eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    if (!isAdmin) {
      const data = await db
        .select({
          idMedico: medicos.idMedico,
          nombres: medicos.nombres,
          apellidoPaterno: medicos.apellidoPaterno,
          apellidoMaterno: medicos.apellidoMaterno,
          especialidad: medicos.especialidad,
          hospitalClinica: medicos.hospitalClinica,
          direccion: medicos.direccion,
          urlFoto: medicos.urlFoto,
          activo: medicos.activo,
        })
        .from(medicos)
        .where(eq(medicos.activo, true))
        .orderBy(asc(medicos.apellidoPaterno));

      return NextResponse.json(data);
    }

    const data = await db
      .select({
        idMedico: medicos.idMedico,
        nombres: medicos.nombres,
        apellidoPaterno: medicos.apellidoPaterno,
        apellidoMaterno: medicos.apellidoMaterno,
        especialidad: medicos.especialidad,
        hospitalClinica: medicos.hospitalClinica,
        direccion: medicos.direccion,
        urlFoto: medicos.urlFoto,
        activo: medicos.activo,
      })
      .from(medicos)
      .orderBy(asc(medicos.apellidoPaterno));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET médicos:", error);

    return NextResponse.json(
      { error: "Error al obtener el directorio médico" },
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

    const nombres =
      typeof body.nombres === "string" ? body.nombres.trim() : "";

    const apellidoPaterno =
      typeof body.apellidoPaterno === "string"
        ? body.apellidoPaterno.trim()
        : "";

    const apellidoMaterno =
      typeof body.apellidoMaterno === "string" &&
      body.apellidoMaterno.trim()
        ? body.apellidoMaterno.trim()
        : null;

    const especialidad =
      typeof body.especialidad === "string"
        ? body.especialidad.trim()
        : "";

    const hospitalClinica =
      typeof body.hospitalClinica === "string" &&
      body.hospitalClinica.trim()
        ? body.hospitalClinica.trim()
        : "Centro Médico Pichardo";

    const direccion =
      typeof body.direccion === "string" && body.direccion.trim()
        ? body.direccion.trim()
        : null;

    const urlFoto =
      typeof body.urlFoto === "string" && body.urlFoto.trim()
        ? body.urlFoto.trim()
        : "/default-doctor.jpg";

    if (!nombres) {
      return NextResponse.json(
        { error: "El nombre del médico es requerido" },
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

    const userEmail = session.user.correo;

    const nuevoMedico = await withUserEmail(userEmail, async () => {
      return await db
        .insert(medicos)
        .values({
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          especialidad,
          hospitalClinica,
          direccion,
          urlFoto,
          activo:
            typeof body.activo === "boolean"
              ? body.activo
              : body.activo === "false"
                ? false
                : true,
        })
        .returning({
          idMedico: medicos.idMedico,
          nombres: medicos.nombres,
          apellidoPaterno: medicos.apellidoPaterno,
          apellidoMaterno: medicos.apellidoMaterno,
          especialidad: medicos.especialidad,
          hospitalClinica: medicos.hospitalClinica,
          direccion: medicos.direccion,
          urlFoto: medicos.urlFoto,
          activo: medicos.activo,
        });
    });

    if (!nuevoMedico.length || !nuevoMedico[0]) {
      return NextResponse.json(
        { error: "Error al registrar médico" },
        { status: 500 }
      );
    }

    return NextResponse.json(nuevoMedico[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST médicos:", error);

    return NextResponse.json(
      { error: "No se pudo registrar el médico" },
      { status: 500 }
    );
  }
}