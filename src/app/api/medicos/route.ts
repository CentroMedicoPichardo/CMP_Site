import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicos } from "@/lib/schema/index";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    // 🛡️ Consulta base ordenada por apellido paterno
    let query = db.select().from(medicos).orderBy(asc(medicos.apellidoPaterno));

    // Si NO es admin, aplicamos el filtro de activos
    if (!isAdmin) {
      // Nota: En Drizzle, para encadenar .where() después de la query base, 
      // a veces es necesario re-asignar o usar la estructura condicional directamente.
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
    
    // Insertamos usando los nuevos campos
    const nuevoMedico = await db.insert(medicos).values({
      nombres: body.nombres,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno, // Puede ser opcional
      especialidad: body.especialidad,
      hospitalClinica: body.hospitalClinica || "Centro Médico Pichardo",
      direccion: body.direccion,
      urlFoto: body.urlFoto || "/default-doctor.jpg", // ¡Aquí puedes usar la imagen por defecto que creamos!
      activo: body.activo !== undefined ? body.activo : true,
    }).returning();

    return NextResponse.json(nuevoMedico[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 ERROR POST MEDICOS:", error);
    return NextResponse.json({ error: "No se pudo registrar", detalle: error.message }, { status: 500 });
  }
}