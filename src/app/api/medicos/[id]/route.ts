// src/app/api/medicos/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicos } from "@/lib/schema/index";
import { and, eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idMedico = Number(id);

    if (!Number.isFinite(idMedico) || idMedico <= 0) {
      return NextResponse.json(
        { error: "ID de médico inválido" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isAdminRequest = searchParams.get("admin") === "true";

    if (isAdminRequest) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const condicion = isAdminRequest
      ? eq(medicos.idMedico, idMedico)
      : and(eq(medicos.idMedico, idMedico), eq(medicos.activo, true));

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
      .where(condicion)
      .limit(1);

    if (!data.length) {
      return NextResponse.json(
        { error: "Médico no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error en GET médico:", error);

    return NextResponse.json(
      { error: "Error al obtener médico" },
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
    const idMedico = Number(id);

    if (!Number.isFinite(idMedico) || idMedico <= 0) {
      return NextResponse.json(
        { error: "ID de médico inválido" },
        { status: 400 }
      );
    }

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

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(medicos)
        .set({
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
        .where(eq(medicos.idMedico, idMedico))
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

    if (!actualizado.length) {
      return NextResponse.json(
        { error: "Médico no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizado[0]);
  } catch (error) {
    console.error("Error en PUT médico:", error);

    return NextResponse.json(
      { error: "Error al actualizar médico" },
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
    const idMedico = Number(id);

    if (!Number.isFinite(idMedico) || idMedico <= 0) {
      return NextResponse.json(
        { error: "ID de médico inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const resultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(medicos)
        .set({
          activo: false,
        })
        .where(eq(medicos.idMedico, idMedico))
        .returning({
          idMedico: medicos.idMedico,
          nombres: medicos.nombres,
          apellidoPaterno: medicos.apellidoPaterno,
          apellidoMaterno: medicos.apellidoMaterno,
          especialidad: medicos.especialidad,
          activo: medicos.activo,
        });
    });

    if (!resultado.length) {
      return NextResponse.json(
        { error: "Médico no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Médico desactivado correctamente",
      medico: resultado[0],
    });
  } catch (error) {
    console.error("Error en DELETE médico:", error);

    return NextResponse.json(
      { error: "Error al desactivar médico" },
      { status: 500 }
    );
  }
}