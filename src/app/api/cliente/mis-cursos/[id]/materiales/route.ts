import {eq, sql} from "drizzle-orm";
import {NextResponse} from "next/server";
import {requireApiAuth} from "@/lib/auth";
import {db} from "@/lib/db";
import {compraParticipantes, comprasCursos, cursos, inscripcionesCursos, participantes} from "@/lib/schema";
import {ESTADOS_INSCRIPCION_VIGENTES, MATERIALS_TIME_ZONE, estadoMateriales} from "@/lib/cursos/materiales";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const headers = {"Cache-Control": "private, no-store, max-age=0", Vary: "Authorization, Cookie"};
function json(body: unknown, status = 200) { return NextResponse.json(body, {status, headers}); }

export async function GET(_request: Request, context: {params: Promise<{id: string}>}) {
  try {
    const {session, error} = await requireApiAuth();
    if (error || !session) return json({success: false, error: "Inicia sesión para consultar materiales"}, 401);
    const {id} = await context.params;
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
      return json({success: false, error: "La inscripción solicitada no es válida"}, 400);
    }
    // Misma pertenencia que el detalle: titular, participante vinculado o comprador.
    const [row] = await db.select({
      idInscripcion: inscripcionesCursos.idInscripcion,
      idCurso: cursos.idCurso,
      estadoInscripcion: inscripcionesCursos.estado,
      fechaInicio: cursos.fechaInicio,
      fechaFin: cursos.fechaFin,
      urlMaterialesDrive: cursos.urlMaterialesDrive,
      hoy: sql<string>`to_char(CURRENT_TIMESTAMP AT TIME ZONE ${MATERIALS_TIME_ZONE}, 'YYYY-MM-DD')`,
    }).from(inscripcionesCursos)
      .innerJoin(cursos, eq(inscripcionesCursos.cursoId, cursos.idCurso))
      .leftJoin(participantes, sql`${inscripcionesCursos.participanteId} = ${participantes.idParticipante}`)
      .leftJoin(compraParticipantes, sql`${inscripcionesCursos.compraParticipanteId} = ${compraParticipantes.idCompraParticipante}`)
      .leftJoin(comprasCursos, sql`${compraParticipantes.idCompra} = ${comprasCursos.idcompra}`)
      .where(sql`${inscripcionesCursos.idInscripcion} = ${Number(id)} AND (
        ${inscripcionesCursos.usuarioId} = ${session.user.id}
        OR ${participantes.usuarioId} = ${session.user.id}
        OR ${comprasCursos.idusuario} = ${session.user.id})`).limit(1);
    if (!row) return json({success: false, error: "No se encontró la inscripción o no tienes autorización"}, 404);
    if (!(ESTADOS_INSCRIPCION_VIGENTES as readonly string[]).includes(row.estadoInscripcion ?? "")) {
      return json({success: false, error: "Tu inscripción no permite acceder a materiales"}, 403);
    }
    const materiales = estadoMateriales(row.fechaInicio, row.fechaFin, row.hoy, row.urlMaterialesDrive);
    return json({success: true, idInscripcion: row.idInscripcion, idCurso: row.idCurso, ...materiales});
  } catch {
    // No registrar objetos SQL, parámetros ni enlaces.
    return json({success: false, error: "No fue posible consultar los materiales"}, 500);
  }
}
