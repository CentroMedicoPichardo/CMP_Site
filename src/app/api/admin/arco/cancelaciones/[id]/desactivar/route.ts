import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { normalizeRole, requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { auditoriaAcciones, preguntasUsuarios, roles, usuarios, } from "@/lib/schema";
const TITULO_ARCO = "Solicitud ARCO - Eliminacion de cuenta";
const CONFIRMACION_REQUERIDA = "DESACTIVAR CUENTA";
const VERSION_TOKEN_MAXIMA = 2147483647;
const ACCIONES_PREVISTAS = [
    "Desactivar el acceso del cliente.",
    "Invalidar sus sesiones y tokens.",
    "Cerrar la solicitud como baja lógica de acceso (sin borrar datos).",
    "Registrar una constancia administrativa de auditoría.",
    "Conservar compras, pagos, inscripciones y participantes.",
];
type Contexto = {
    params: Promise<{
        id: string;
    }>;
};
type Modo = "simular" | "ejecutar";
class ErrorArco extends Error {
    constructor(public readonly status: number, mensaje: string) {
        super(mensaje);
        this.name = "ErrorArco";
    }
}
function responder(datos: unknown, status = 200) {
    return NextResponse.json(datos, {
        status,
        headers: { "Cache-Control": "no-store" },
    });
}
function validarEstado(solicitud: {
    id: number;
    usuarioId: number;
    estado: string | null;
} | undefined) {
    if (!solicitud) {
        throw new ErrorArco(404, "Solicitud ARCO no encontrada.");
    }
    if (solicitud.estado !== "pendiente") {
        throw new ErrorArco(409, "La solicitud ya no se encuentra pendiente.");
    }
}
function validarUsuario(usuario: {
    id: number;
    activo: boolean | null;
    versionToken: number | null;
    rolId: number;
} | undefined, nombreRol: string | null | undefined, adminId: number): number {
    if (!usuario) {
        throw new ErrorArco(404, "La cuenta del cliente no existe.");
    }
    if (usuario.id === adminId) {
        throw new ErrorArco(403, "No puedes desactivar tu propia cuenta.");
    }
    if (!nombreRol || normalizeRole(nombreRol) !== "cliente") {
        throw new ErrorArco(403, "Solo pueden desactivarse cuentas con rol cliente.");
    }
    if (usuario.activo !== true) {
        throw new ErrorArco(409, "La cuenta ya está desactivada.");
    }
    const versionActual = Number(usuario.versionToken ?? 1);
    if (!Number.isSafeInteger(versionActual) ||
        versionActual < 1 ||
        versionActual >= VERSION_TOKEN_MAXIMA) {
        throw new ErrorArco(409, "La versión del token no permite desactivar esta cuenta.");
    }
    return versionActual;
}
/**

 * POST /api/admin/arco/cancelaciones/[id]/desactivar

 *

 * Simular no modifica registros.

 * Ejecutar requiere autorización expresa en el servidor,

 * confirmación adicional y transacción atómica.

 * Nunca borra ni anonimiza datos personales.

 */
export async function POST(request: NextRequest, { params }: Contexto) {
    const { session, error } = await requireApiRole("admin");
    if (error)
        return error;
    if (!session)
        return responder({ message: "No autenticado" }, 401);
    // Esta operación se inicia únicamente desde el panel web del mismo origen.
    // No permitir peticiones sin Origin ni peticiones de otro sitio.
    const origen = request.headers.get("origin");
    const origenPermitido = new URL(request.url).origin;
    const contextoNavegador = request.headers.get("sec-fetch-site");
    if (origen !== origenPermitido ||
        (contextoNavegador !== null &&
            contextoNavegador !== "same-origin" &&
            contextoNavegador !== "none")) {
        return responder({ message: "El origen de la petición no está autorizado." }, 403);
    }
    const tipoContenido = request.headers.get("content-type") ?? "";
    if (!/^application\/json(?:\s*;|\s*$)/i.test(tipoContenido)) {
        return responder({ message: "La petición debe enviarse como JSON." }, 415);
    }
    const { id } = await params;
    const solicitudId = Number(id);
    if (!Number.isSafeInteger(solicitudId) || solicitudId <= 0) {
        return responder({ message: "El identificador de la solicitud no es válido." }, 400);
    }
    const payload: unknown = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return responder({ message: "Cuerpo JSON inválido." }, 400);
    }
    const body = payload as Record<string, unknown>;
    if (body.modo !== "simular" && body.modo !== "ejecutar") {
        return responder({ message: "El modo debe ser simular o ejecutar." }, 400);
    }
    const modo: Modo = body.modo;
    // Sin esta variable, la baja real permanece bloqueada aun en localhost,
    // porque localhost está conectado a la base de datos de producción.
    const ejecucionHabilitada = process.env.ARCO_DESACTIVACION_HABILITADA === "true";
    if (modo === "ejecutar") {
        if (!ejecucionHabilitada) {
            return responder({
                message: "La desactivación real está deshabilitada en el servidor.",
                ejecucionHabilitada: false,
                ejecutada: false,
            }, 423);
        }
        if (body.confirmacion !== CONFIRMACION_REQUERIDA) {
            return responder({ message: "La frase de confirmación no coincide." }, 400);
        }
        if (typeof body.usuarioIdConfirmado !== "number" ||
            !Number.isSafeInteger(body.usuarioIdConfirmado) ||
            body.usuarioIdConfirmado <= 0) {
            return responder({ message: "Debes confirmar el ID del usuario." }, 400);
        }
    }
    try {
        if (modo === "simular") {
            // Lecturas sin FOR UPDATE: la simulación no bloquea filas en producción.
            const [solicitud] = await db
                .select({
                id: preguntasUsuarios.idPregunta,
                usuarioId: preguntasUsuarios.idUsuario,
                estado: preguntasUsuarios.estado,
            })
                .from(preguntasUsuarios)
                .where(and(eq(preguntasUsuarios.idPregunta, solicitudId), eq(preguntasUsuarios.titulo, TITULO_ARCO), eq(preguntasUsuarios.esPrivada, true)))
                .limit(1);
            validarEstado(solicitud);
            if (!solicitud)
                throw new ErrorArco(404, "Solicitud ARCO no encontrada.");
            const [usuario] = await db
                .select({
                id: usuarios.id,
                activo: usuarios.activo,
                versionToken: usuarios.versionToken,
                rolId: usuarios.rolId,
                nombreRol: roles.nombre,
            })
                .from(usuarios)
                .innerJoin(roles, eq(usuarios.rolId, roles.id))
                .where(eq(usuarios.id, solicitud.usuarioId))
                .limit(1);
            validarUsuario(usuario, usuario?.nombreRol, session.user.id);
            return responder({
                status: 200,
                datos: {
                    message: "Simulación completada. No se modificaron registros.",
                    solicitudId: solicitud.id,
                    usuarioId: solicitud.usuarioId,
                    modo: "simular" as const,
                    ejecutada: false,
                    ejecucionHabilitada,
                    estadoSolicitud: solicitud.estado,
                    cuentaActiva: usuario?.activo === true,
                    accionesPrevistas: ACCIONES_PREVISTAS,
                    registrosEliminados: 0,
                    datosPersonalesEliminados: false,
                },
            });
        }
        // La base de datos de producción solo se modifica con modo=ejecutar
        // y ARCO_DESACTIVACION_HABILITADA=true configurado explícitamente.
        const resultado = await db.transaction(async (tx) => {
            const [solicitud] = await tx
                .select({
                id: preguntasUsuarios.idPregunta,
                usuarioId: preguntasUsuarios.idUsuario,
                estado: preguntasUsuarios.estado,
            })
                .from(preguntasUsuarios)
                .where(and(eq(preguntasUsuarios.idPregunta, solicitudId), eq(preguntasUsuarios.titulo, TITULO_ARCO), eq(preguntasUsuarios.esPrivada, true)))
                .limit(1)
                .for("update");
            validarEstado(solicitud);
            if (!solicitud)
                throw new ErrorArco(404, "Solicitud ARCO no encontrada.");
            if (body.usuarioIdConfirmado !== solicitud.usuarioId) {
                throw new ErrorArco(409, "El ID confirmado no corresponde al cliente de la solicitud.");
            }
            const [usuario] = await tx
                .select({
                id: usuarios.id,
                activo: usuarios.activo,
                versionToken: usuarios.versionToken,
                rolId: usuarios.rolId,
            })
                .from(usuarios)
                .where(eq(usuarios.id, solicitud.usuarioId))
                .limit(1)
                .for("update");
            if (!usuario)
                throw new ErrorArco(404, "La cuenta del cliente no existe.");
            const [rolUsuario] = await tx
                .select({ nombre: roles.nombre })
                .from(roles)
                .where(eq(roles.id, usuario.rolId))
                .limit(1);
            const versionActual = validarUsuario(usuario, rolUsuario?.nombre, session.user.id);
            const [actualizado] = await tx
                .update(usuarios)
                .set({ activo: false, versionToken: versionActual + 1 })
                .where(and(eq(usuarios.id, usuario.id), eq(usuarios.activo, true)))
                .returning({ id: usuarios.id });
            if (!actualizado) {
                throw new ErrorArco(409, "No fue posible desactivar la cuenta.");
            }
            const [solicitudActualizada] = await tx
                .update(preguntasUsuarios)
                .set({ estado: "cerrada", updatedAt: new Date().toISOString() })
                .where(and(eq(preguntasUsuarios.idPregunta, solicitud.id), eq(preguntasUsuarios.estado, "pendiente")))
                .returning({ id: preguntasUsuarios.idPregunta });
            if (!solicitudActualizada) {
                throw new ErrorArco(409, "No fue posible actualizar la solicitud.");
            }
            const [auditoria] = await tx
                .insert(auditoriaAcciones)
                .values({
                usuario: `admin:${session.user.id}`,
                accion: "ARCO_BAJA_LOGICA",
                tablaAfectada: "seguridad.usuarios",
                registroId: usuario.id,
                aplicacionOrigen: "CMP_Site",
                datosAnteriores: {
                    activo: true,
                    versionToken: versionActual,
                    solicitudId: solicitud.id,
                    estadoSolicitud: solicitud.estado,
                },
                datosNuevos: {
                    activo: false,
                    versionToken: versionActual + 1,
                    solicitudId: solicitud.id,
                    estadoSolicitud: "cerrada",
                    tipoTratamiento: "DESACTIVACION_ACCESO",
                    datosPersonalesEliminados: false,
                },
            })
                .returning({ id: auditoriaAcciones.idAuditoria });
            if (!auditoria) {
                throw new Error("No fue posible registrar la auditoría.");
            }
            return {
                solicitudId: solicitud.id,
                usuarioId: usuario.id,
                modo: "ejecutar" as const,
                ejecutada: true,
                cuentaActiva: false,
                sesionesInvalidadas: true,
                estadoSolicitud: "cerrada",
                auditoriaId: auditoria.id,
                registrosEliminados: 0,
                datosPersonalesEliminados: false,
            };
        });
        return responder({
            status: 200,
            datos: {
                message: "La cuenta fue desactivada. Sus registros personales, académicos y financieros siguen almacenados.",
                ...resultado,
            },
        });
    }
    catch (errorProceso: unknown) {
        if (errorProceso instanceof ErrorArco) {
            return responder({ message: errorProceso.message }, errorProceso.status);
        }
        console.error("Error en baja lógica ARCO:", errorProceso);
        return responder({ message: "No fue posible procesar la baja lógica." }, 500);
    }
}
