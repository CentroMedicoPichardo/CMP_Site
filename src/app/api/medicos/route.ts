// src/app/api/medicos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicos } from "@/lib/schema/index";
import { asc, eq } from "drizzle-orm";
import { withAudit, getClientIp, getCurrentUserEmail } from "@/lib/db-audit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    // 🛡️ Consulta base ordenada por apellido paterno
    let query = db.select().from(medicos).orderBy(asc(medicos.apellidoPaterno));

    // Si NO es admin, aplicamos el filtro de activos
    if (!isAdmin) {
      const data = await db.select()
        .from(medicos)
        .where(eq(medicos.activo, true))
        .orderBy(asc(medicos.apellidoPaterno));
      return NextResponse.json(data);
    }

    const data = await query;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 ERROR GET MEDICOS:", error);
    return NextResponse.json({ error: "Error al obtener el directorio", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);
    const userEmail = await getCurrentUserEmail();

    console.log("🔵 POST MEDICO - Usuario:", userEmail);
    console.log("🔵 POST MEDICO - IP:", clientIp);
    console.log("🔵 POST MEDICO - Datos:", body);

    // Insertamos usando los nuevos campos con contexto de auditoría
    const nuevoMedico = await withAudit(userEmail, clientIp, async () => {
      return await db.insert(medicos).values({
        nombres: body.nombres,
        apellidoPaterno: body.apellidoPaterno,
        apellidoMaterno: body.apellidoMaterno,
        especialidad: body.especialidad,
        hospitalClinica: body.hospitalClinica || "Centro Médico Pichardo",
        direccion: body.direccion,
        urlFoto: body.urlFoto || "/default-doctor.jpg",
        activo: body.activo !== undefined ? body.activo : true,
      }).returning();
    });

    console.log("🟢 POST MEDICO - Médico creado ID:", nuevoMedico[0]?.idMedico);
    return NextResponse.json(nuevoMedico[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 ERROR POST MEDICOS:", error);
    return NextResponse.json({ error: "No se pudo registrar", detalle: error.message }, { status: 500 });
  }
}