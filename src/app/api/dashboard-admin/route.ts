import {
  NextRequest,
  NextResponse,
} from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { requireApiRole } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DbRow = Record<string, unknown>;

type PeriodoDashboard =
  | "7_dias"
  | "30_dias"
  | "90_dias"
  | "este_anio";

type TipoAlerta =
  | "informativa"
  | "advertencia"
  | "critica";

interface RangoPeriodo {
  clave: PeriodoDashboard;
  etiqueta: string;
  desdeActual: Date;
  hastaActual: Date;
  desdeAnterior: Date;
  hastaAnterior: Date;
}

interface TendenciaDashboard {
  actual: number;
  anterior: number;
  diferencia: number;
  porcentaje: number;
  direccion:
    | "sube"
    | "baja"
    | "igual";
}

interface AlertaDashboard {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  descripcion: string;
  cantidad: number;
  enlace: string;
}

function obtenerFilas(
  resultado: unknown,
): DbRow[] {
  if (Array.isArray(resultado)) {
    return resultado as DbRow[];
  }

  if (
    resultado &&
    typeof resultado === "object" &&
    "rows" in resultado
  ) {
    const filas = (
      resultado as {
        rows?: unknown;
      }
    ).rows;

    if (Array.isArray(filas)) {
      return filas as DbRow[];
    }
  }

  return [];
}

function obtenerPrimeraFila(
  resultado: unknown,
): DbRow {
  return obtenerFilas(resultado)[0] ?? {};
}

function numero(valor: unknown): number {
  if (typeof valor === "bigint") {
    return Number(valor);
  }

  const convertido = Number(valor);

  return Number.isFinite(convertido)
    ? convertido
    : 0;
}

function entero(valor: unknown): number {
  return Math.trunc(numero(valor));
}

function decimal(
  valor: unknown,
  decimales = 2,
): number {
  const factor = 10 ** decimales;

  return (
    Math.round(numero(valor) * factor) /
    factor
  );
}

function texto(
  valor: unknown,
  respaldo = "",
): string {
  if (
    typeof valor === "string" &&
    valor.trim()
  ) {
    return valor.trim();
  }

  if (
    typeof valor === "number" ||
    typeof valor === "bigint"
  ) {
    return String(valor);
  }

  return respaldo;
}

function booleano(valor: unknown): boolean {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (typeof valor === "number") {
    return valor !== 0;
  }

  if (typeof valor === "string") {
    return [
      "true",
      "t",
      "1",
      "si",
      "sí",
    ].includes(
      valor
        .trim()
        .toLocaleLowerCase("es-MX"),
    );
  }

  return false;
}

function fechaComoTexto(
  valor: unknown,
): string | null {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date) {
    return valor.toISOString();
  }

  if (typeof valor === "string") {
    return valor;
  }

  return null;
}

function restarDias(
  fecha: Date,
  dias: number,
): Date {
  return new Date(
    fecha.getTime() -
      dias * 24 * 60 * 60 * 1000,
  );
}

function resolverPeriodo(
  valor: string | null,
): RangoPeriodo {
  const ahora = new Date();

  const clave: PeriodoDashboard =
    valor === "7_dias" ||
    valor === "30_dias" ||
    valor === "90_dias" ||
    valor === "este_anio"
      ? valor
      : "30_dias";

  if (clave === "este_anio") {
    const desdeActual = new Date(
      Date.UTC(
        ahora.getUTCFullYear(),
        0,
        1,
        0,
        0,
        0,
        0,
      ),
    );

    const desdeAnterior = new Date(
      Date.UTC(
        ahora.getUTCFullYear() - 1,
        0,
        1,
        0,
        0,
        0,
        0,
      ),
    );

    const hastaAnterior = new Date(ahora);

    hastaAnterior.setUTCFullYear(
      ahora.getUTCFullYear() - 1,
    );

    return {
      clave,
      etiqueta: "Este año",
      desdeActual,
      hastaActual: ahora,
      desdeAnterior,
      hastaAnterior,
    };
  }

  const diasPorPeriodo = {
    "7_dias": 7,
    "30_dias": 30,
    "90_dias": 90,
  } as const;

  const dias = diasPorPeriodo[clave];
  const desdeActual = restarDias(
    ahora,
    dias,
  );

  return {
    clave,
    etiqueta:
      clave === "7_dias"
        ? "Últimos 7 días"
        : clave === "90_dias"
          ? "Últimos 90 días"
          : "Últimos 30 días",
    desdeActual,
    hastaActual: ahora,
    desdeAnterior: restarDias(
      desdeActual,
      dias,
    ),
    hastaAnterior: desdeActual,
  };
}

function crearTendencia(
  actual: number,
  anterior: number,
): TendenciaDashboard {
  const diferencia = actual - anterior;

  const porcentaje =
    anterior === 0
      ? actual === 0
        ? 0
        : 100
      : decimal(
          (diferencia /
            Math.abs(anterior)) *
            100,
          1,
        );

  return {
    actual,
    anterior,
    diferencia,
    porcentaje,
    direccion:
      diferencia > 0
        ? "sube"
        : diferencia < 0
          ? "baja"
          : "igual",
  };
}

function construirAlertas(
  fila: DbRow,
): AlertaDashboard[] {
  const alertas: AlertaDashboard[] = [];

  const pagosPorValidar = entero(
    fila.pagosPorValidar,
  );

  const preguntasUrgentes = entero(
    fila.preguntasUrgentes,
  );

  const preguntasPendientes = entero(
    fila.preguntasPendientes,
  );

  const cursosBajaOcupacion = entero(
    fila.cursosBajaOcupacion,
  );

  const cursosCupoCompleto = entero(
    fila.cursosCupoCompleto,
  );

  const cuentasBloqueadas = entero(
    fila.cuentasBloqueadas,
  );

  const respaldosFallidos = entero(
    fila.respaldosFallidos,
  );

  if (preguntasUrgentes > 0) {
    alertas.push({
      id: "preguntas-urgentes",
      tipo: "critica",
      titulo:
        "Preguntas urgentes pendientes",
      descripcion:
        "Existen consultas urgentes que todavía requieren atención.",
      cantidad: preguntasUrgentes,
      enlace: "/admin/soporte",
    });
  }

  if (pagosPorValidar > 0) {
    alertas.push({
      id: "pagos-por-validar",
      tipo: "advertencia",
      titulo: "Pagos por validar",
      descripcion:
        "Hay pagos reportados o en revisión pendientes de validación.",
      cantidad: pagosPorValidar,
      enlace: "/admin/pagos",
    });
  }

  if (cursosBajaOcupacion > 0) {
    alertas.push({
      id: "cursos-baja-ocupacion",
      tipo: "advertencia",
      titulo:
        "Cursos próximos con baja ocupación",
      descripcion:
        "Algunos cursos comienzan en los próximos siete días y tienen menos del 40 % de ocupación.",
      cantidad: cursosBajaOcupacion,
      enlace: "/admin/cursos",
    });
  }

  if (cuentasBloqueadas > 0) {
    alertas.push({
      id: "cuentas-bloqueadas",
      tipo: "advertencia",
      titulo:
        "Cuentas temporalmente bloqueadas",
      descripcion:
        "Existen cuentas bloqueadas por intentos fallidos de acceso.",
      cantidad: cuentasBloqueadas,
      enlace: "/admin/usuarios",
    });
  }

  if (respaldosFallidos > 0) {
    alertas.push({
      id: "respaldos-fallidos",
      tipo: "critica",
      titulo:
        "Respaldos con errores",
      descripcion:
        "Se detectaron respaldos no exitosos durante los últimos siete días.",
      cantidad: respaldosFallidos,
      enlace: "/admin/auditoria",
    });
  }

  if (preguntasPendientes > 0) {
    alertas.push({
      id: "preguntas-pendientes",
      tipo: "informativa",
      titulo:
        "Consultas esperando respuesta",
      descripcion:
        "Hay preguntas de soporte que aún no han sido atendidas.",
      cantidad: preguntasPendientes,
      enlace: "/admin/soporte",
    });
  }

  if (cursosCupoCompleto > 0) {
    alertas.push({
      id: "cursos-cupo-completo",
      tipo: "informativa",
      titulo:
        "Cursos con cupo completo",
      descripcion:
        "Estos cursos alcanzaron el máximo de participantes permitido.",
      cantidad: cursosCupoCompleto,
      enlace: "/admin/cursos",
    });
  }

  return alertas;
}

export async function GET(
  request: NextRequest,
) {
  const { error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  const periodo = resolverPeriodo(
    request.nextUrl.searchParams.get(
      "periodo",
    ),
  );

  const desdeActual =
    periodo.desdeActual.toISOString();

  const hastaActual =
    periodo.hastaActual.toISOString();

  const desdeAnterior =
    periodo.desdeAnterior.toISOString();

  const hastaAnterior =
    periodo.hastaAnterior.toISOString();

  try {
    const [
      resumenResult,
      tendenciasResult,
      cursosRecientesResult,
      usuariosResult,
      inscripcionesResult,
      alertasResult,
      actividadResult,
    ] = await Promise.all([
      db.execute(sql`
        WITH resumen_pagos AS (
          SELECT
            COALESCE(
              SUM(monto) FILTER (
                WHERE LOWER(estado) =
                  'aprobado'
              ),
              0
            ) AS "ingresosTotales",

            COALESCE(
              SUM(monto) FILTER (
                WHERE LOWER(estado) IN (
                  'reportado',
                  'en revisión',
                  'en revision'
                )
              ),
              0
            ) AS "montoPorRevisar",

            COALESCE(
              SUM(monto) FILTER (
                WHERE LOWER(estado) IN (
                  'reportado',
                  'en revisión',
                  'en revision',
                  'aprobado'
                )
              ),
              0
            ) AS "montoReportado",

            COALESCE(
              SUM(monto) FILTER (
                WHERE LOWER(estado) =
                  'rechazado'
              ),
              0
            ) AS "montoRechazado",

            COALESCE(
              SUM(monto) FILTER (
                WHERE LOWER(estado) =
                  'cancelado'
              ),
              0
            ) AS "montoCancelado",

            COUNT(*) FILTER (
              WHERE LOWER(estado) =
                'reportado'
            ) AS "pagosReportados",

            COUNT(*) FILTER (
              WHERE LOWER(estado) IN (
                'en revisión',
                'en revision'
              )
            ) AS "pagosEnRevision",

            COUNT(*) FILTER (
              WHERE LOWER(estado) =
                'aprobado'
            ) AS "pagosAprobados",

            COUNT(*) FILTER (
              WHERE LOWER(estado) =
                'rechazado'
            ) AS "pagosRechazados",

            COUNT(*) FILTER (
              WHERE LOWER(estado) =
                'cancelado'
            ) AS "pagosCancelados"

          FROM academia.pagos_cursos
        )

        SELECT
          (
            SELECT COUNT(*)
            FROM seguridad.usuarios
          ) AS "totalUsuarios",

          (
            SELECT COUNT(*)
            FROM seguridad.usuarios
            WHERE activo = true
          ) AS "cuentasActivas",

          (
            SELECT COUNT(*)
            FROM seguridad.usuarios
            WHERE activo = false
          ) AS "cuentasInactivas",

          (
            SELECT COUNT(*)
            FROM academia.cursos
          ) AS "totalCursos",

          (
            SELECT COUNT(*)
            FROM academia.cursos
            WHERE activo = true
          ) AS "cursosActivos",

          (
            SELECT COUNT(*)
            FROM academia.inscripciones_cursos
          ) AS "totalInscripciones",

          (
            SELECT COUNT(*)
            FROM academia.inscripciones_cursos
            WHERE LOWER(
              COALESCE(estado, '')
            ) IN (
              'activo',
              'activa',
              'confirmado',
              'confirmada'
            )
          ) AS "inscripcionesActivas",

          (
            SELECT COALESCE(
              SUM(
                COALESCE(
                  cupos_ocupados,
                  0
                )
              )::numeric
              /
              NULLIF(
                SUM(cupo_maximo),
                0
              )::numeric
              * 100,
              0
            )
            FROM academia.cursos
            WHERE activo = true
          ) AS "tasaOcupacion",

          (
            SELECT COUNT(*)
            FROM soporte.preguntas_usuarios
            WHERE LOWER(
              COALESCE(
                estado,
                'pendiente'
              )
            ) = 'pendiente'
          ) AS "preguntasPendientes",

          resumen_pagos.*

        FROM resumen_pagos
      `),

      db.execute(sql`
        SELECT
          (
            SELECT COUNT(
              DISTINCT COALESCE(
                registro_id,
                id_auditoria
              )
            )
            FROM seguridad.auditoria_acciones
            WHERE fecha_hora >=
              ${desdeActual}::timestamp
              AND fecha_hora <
              ${hastaActual}::timestamp
              AND LOWER(
                COALESCE(
                  tabla_afectada,
                  ''
                )
              ) LIKE '%usuarios%'
              AND (
                LOWER(
                  COALESCE(
                    accion,
                    ''
                  )
                ) LIKE '%insert%'
                OR LOWER(
                  COALESCE(
                    accion,
                    ''
                  )
                ) LIKE '%crea%'
                OR LOWER(
                  COALESCE(
                    accion,
                    ''
                  )
                ) LIKE '%registr%'
              )
          ) AS "usuariosActual",

          (
            SELECT COUNT(
              DISTINCT COALESCE(
                registro_id,
                id_auditoria
              )
            )
            FROM seguridad.auditoria_acciones
            WHERE fecha_hora >=
              ${desdeAnterior}::timestamp
              AND fecha_hora <
              ${hastaAnterior}::timestamp
              AND LOWER(
                COALESCE(
                  tabla_afectada,
                  ''
                )
              ) LIKE '%usuarios%'
              AND (
                LOWER(
                  COALESCE(
                    accion,
                    ''
                  )
                ) LIKE '%insert%'
                OR LOWER(
                  COALESCE(
                    accion,
                    ''
                  )
                ) LIKE '%crea%'
                OR LOWER(
                  COALESCE(
                    accion,
                    ''
                  )
                ) LIKE '%registr%'
              )
          ) AS "usuariosAnterior",

          (
            SELECT COUNT(*)
            FROM academia.inscripciones_cursos
            WHERE fecha_inscripcion >=
              ${desdeActual}::timestamp
              AND fecha_inscripcion <
              ${hastaActual}::timestamp
          ) AS "inscripcionesActual",

          (
            SELECT COUNT(*)
            FROM academia.inscripciones_cursos
            WHERE fecha_inscripcion >=
              ${desdeAnterior}::timestamp
              AND fecha_inscripcion <
              ${hastaAnterior}::timestamp
          ) AS "inscripcionesAnterior",

          (
            SELECT COALESCE(
              SUM(monto),
              0
            )
            FROM academia.pagos_cursos
            WHERE LOWER(estado) =
              'aprobado'
              AND COALESCE(
                fecha_validacion,
                fecha_pago,
                fecha_reporte,
                created_at
              ) >= ${desdeActual}::timestamp
              AND COALESCE(
                fecha_validacion,
                fecha_pago,
                fecha_reporte,
                created_at
              ) < ${hastaActual}::timestamp
          ) AS "ingresosActual",

          (
            SELECT COALESCE(
              SUM(monto),
              0
            )
            FROM academia.pagos_cursos
            WHERE LOWER(estado) =
              'aprobado'
              AND COALESCE(
                fecha_validacion,
                fecha_pago,
                fecha_reporte,
                created_at
              ) >= ${desdeAnterior}::timestamp
              AND COALESCE(
                fecha_validacion,
                fecha_pago,
                fecha_reporte,
                created_at
              ) < ${hastaAnterior}::timestamp
          ) AS "ingresosAnterior"
      `),

      db.execute(sql`
        SELECT
          c.id_curso AS "idCurso",
          c.titulo_curso AS "tituloCurso",
          c.cupos_ocupados
            AS "cuposOcupados",
          c.cupo_maximo
            AS "cupoMaximo",
          c.costo AS "costo",
          c.fecha_inicio
            AS "fechaInicio",
          c.fecha_fin AS "fechaFin",
          c.activo AS "activo",

          CONCAT_WS(
            ' ',
            instructor.nombre,
            instructor.apellido_paterno,
            instructor.apellido_materno
          ) AS "instructor",

          categoria.nombre_categoria
            AS "categoria",

          modalidad.nombre_modalidad
            AS "modalidad",

          CASE
            WHEN c.activo = false
              THEN 'Inactivo'
            WHEN CURRENT_DATE <
              c.fecha_inicio
              THEN 'Próximo'
            WHEN CURRENT_DATE
              BETWEEN c.fecha_inicio
              AND c.fecha_fin
              THEN 'En curso'
            ELSE 'Finalizado'
          END AS "estadoCurso",

          CASE
            WHEN c.cupo_maximo <= 0
              THEN 0
            ELSE ROUND(
              COALESCE(
                c.cupos_ocupados,
                0
              )::numeric
              /
              c.cupo_maximo::numeric
              * 100,
              2
            )
          END AS "porcentajeOcupacion",

          (
            SELECT COUNT(*)
            FROM academia.inscripciones_cursos i
            WHERE i.curso_id =
              c.id_curso
              AND LOWER(
                COALESCE(
                  i.estado,
                  ''
                )
              ) NOT IN (
                'cancelado',
                'cancelada'
              )
          ) AS "totalInscripciones",

          (
            SELECT COALESCE(
              SUM(p.monto),
              0
            )
            FROM academia.comprascursosinacademia compra
            JOIN academia.pagos_cursos p
              ON p.id_compra =
                compra.idcompra
            WHERE compra.idcurso =
              c.id_curso
              AND LOWER(p.estado) =
                'aprobado'
          ) AS "ingresosAprobados"

        FROM academia.cursos c

        LEFT JOIN academia.instructores instructor
          ON instructor.id_instructor =
            c.id_instructor

        LEFT JOIN academia.categorias_cursos categoria
          ON categoria.id_categoria =
            c.id_categoria

        LEFT JOIN academia.modalidades modalidad
          ON modalidad.id_modalidad =
            c.id_modalidad

        ORDER BY
          c.created_at DESC NULLS LAST,
          c.id_curso DESC

        LIMIT 3
      `),

      db.execute(sql`
        SELECT
          u.id AS "id",
          u.nombre AS "nombre",
          u."apellidoPaterno"
            AS "apellidoPaterno",
          u."apellidoMaterno"
            AS "apellidoMaterno",
          u.correo AS "correo",
          u.telefono AS "telefono",
          u.activo AS "activo",
          u.mfa_habilitado
            AS "mfaHabilitado",
          u.bloqueado_hasta
            AS "bloqueadoHasta",
          COALESCE(
            r.nombre,
            'cliente'
          ) AS "rol"

        FROM seguridad.usuarios u

        LEFT JOIN seguridad.roles r
          ON r.id = u.rol_id

        WHERE u.activo = true and u.rol_id != 1

        ORDER BY u.id DESC

        LIMIT 8
      `),

      db.execute(sql`
        SELECT
          i.id_inscripcion AS "id",
          i.curso_id AS "idCurso",
          c.titulo_curso AS "curso",

          COALESCE(
            NULLIF(
              CONCAT_WS(
                ' ',
                u.nombre,
                u."apellidoPaterno",
                u."apellidoMaterno"
              ),
              ''
            ),
            NULLIF(
              CONCAT_WS(
                ' ',
                participante.nombre,
                participante.apellido_paterno,
                participante.apellido_materno
              ),
              ''
            ),
            'Participante sin nombre'
          ) AS "usuario",

          COALESCE(
            u.correo,
            participante.correo
          ) AS "correo",

          i.fecha_inscripcion
            AS "fecha",
          i.fecha_confirmacion
            AS "fechaConfirmacion",
          i.estado AS "estado",
          i.monto_pagado
            AS "montoPagado",
          i.metodo_pago
            AS "metodoPago",
          i.origen_inscripcion
            AS "origenInscripcion"

        FROM academia.inscripciones_cursos i

        JOIN academia.cursos c
          ON c.id_curso =
            i.curso_id

        LEFT JOIN seguridad.usuarios u
          ON u.id = i.usuario_id

        LEFT JOIN academia.participantes participante
          ON participante.id_participante =
            i.participante_id

        ORDER BY
          i.fecha_inscripcion DESC NULLS LAST,
          i.id_inscripcion DESC

        LIMIT 8
      `),

      db.execute(sql`
        SELECT
          (
            SELECT COUNT(*)
            FROM academia.pagos_cursos
            WHERE LOWER(estado) IN (
              'reportado',
              'en revisión',
              'en revision'
            )
          ) AS "pagosPorValidar",

          (
            SELECT COUNT(*)
            FROM soporte.preguntas_usuarios
            WHERE LOWER(
              COALESCE(
                estado,
                'pendiente'
              )
            ) = 'pendiente'
              AND LOWER(
                COALESCE(
                  prioridad,
                  ''
                )
              ) = 'urgente'
          ) AS "preguntasUrgentes",

          (
            SELECT COUNT(*)
            FROM soporte.preguntas_usuarios
            WHERE LOWER(
              COALESCE(
                estado,
                'pendiente'
              )
            ) = 'pendiente'
          ) AS "preguntasPendientes",

          (
            SELECT COUNT(*)
            FROM academia.cursos
            WHERE activo = true
              AND fecha_inicio
                BETWEEN CURRENT_DATE
                AND CURRENT_DATE + 7
              AND (
                COALESCE(
                  cupos_ocupados,
                  0
                )::numeric
                /
                NULLIF(
                  cupo_maximo,
                  0
                )::numeric
              ) < 0.40
          ) AS "cursosBajaOcupacion",

          (
            SELECT COUNT(*)
            FROM academia.cursos
            WHERE activo = true
              AND COALESCE(
                cupos_ocupados,
                0
              ) >= cupo_maximo
          ) AS "cursosCupoCompleto",

          (
            SELECT COUNT(*)
            FROM seguridad.usuarios
            WHERE bloqueado_hasta >
              CURRENT_TIMESTAMP
          ) AS "cuentasBloqueadas",

          (
            SELECT COUNT(*)
            FROM auditoria.backups
            WHERE fecha >=
              CURRENT_TIMESTAMP -
              INTERVAL '7 days'
              AND LOWER(
                COALESCE(
                  estado,
                  ''
                )
              ) <> 'exitoso'
          ) AS "respaldosFallidos"
      `),

      db.execute(sql`
        SELECT
          id_auditoria AS "id",
          COALESCE(
            usuario,
            'Sistema'
          ) AS "usuario",
          COALESCE(
            accion,
            'Acción no especificada'
          ) AS "accion",
          COALESCE(
            tabla_afectada,
            'Sistema'
          ) AS "modulo",
          registro_id AS "registroId",
          fecha_hora AS "fecha",
          aplicacion_origen
            AS "aplicacionOrigen"

        FROM seguridad.auditoria_acciones

        ORDER BY
          fecha_hora DESC NULLS LAST,
          id_auditoria DESC

        LIMIT 10
      `),
    ]);

    const resumen =
      obtenerPrimeraFila(resumenResult);

    const tendencias =
      obtenerPrimeraFila(
        tendenciasResult,
      );

    const alertasConteo =
      obtenerPrimeraFila(alertasResult);

    const usuariosActual = entero(
      tendencias.usuariosActual,
    );

    const usuariosAnterior = entero(
      tendencias.usuariosAnterior,
    );

    const inscripcionesActual = entero(
      tendencias.inscripcionesActual,
    );

    const inscripcionesAnterior = entero(
      tendencias.inscripcionesAnterior,
    );

    const ingresosActual = decimal(
      tendencias.ingresosActual,
    );

    const ingresosAnterior = decimal(
      tendencias.ingresosAnterior,
    );

    const alertas =
      construirAlertas(alertasConteo);

    return NextResponse.json(
      {
        generadoEn:
          new Date().toISOString(),

        periodo: {
          clave: periodo.clave,
          etiqueta: periodo.etiqueta,
          desde: desdeActual,
          hasta: hastaActual,

          periodoAnterior: {
            desde: desdeAnterior,
            hasta: hastaAnterior,
          },
        },

        stats: {
          totalUsuarios: entero(
            resumen.totalUsuarios,
          ),

          totalCursos: entero(
            resumen.totalCursos,
          ),

          totalInscripciones: entero(
            resumen.totalInscripciones,
          ),

          ingresosTotales: decimal(
            resumen.ingresosTotales,
          ),

          cursosActivos: entero(
            resumen.cursosActivos,
          ),

          usuariosNuevosMes:
            usuariosActual,

          tasaOcupacion: decimal(
            resumen.tasaOcupacion,
            1,
          ),

          cuentasActivas: entero(
            resumen.cuentasActivas,
          ),

          cuentasInactivas: entero(
            resumen.cuentasInactivas,
          ),

          inscripcionesActivas: entero(
            resumen.inscripcionesActivas,
          ),

          ingresosPeriodo:
            ingresosActual,

          inscripcionesPeriodo:
            inscripcionesActual,

          usuariosNuevosPeriodo:
            usuariosActual,

          pagosPendientes:
            entero(
              resumen.pagosReportados,
            ) +
            entero(
              resumen.pagosEnRevision,
            ),

          preguntasPendientes: entero(
            resumen.preguntasPendientes,
          ),

          totalAlertas:
            alertas.length,

          montoReportado: decimal(
            resumen.montoReportado,
          ),

          montoPorRevisar: decimal(
            resumen.montoPorRevisar,
          ),

          montoRechazado: decimal(
            resumen.montoRechazado,
          ),

          montoCancelado: decimal(
            resumen.montoCancelado,
          ),

          pagosReportados: entero(
            resumen.pagosReportados,
          ),

          pagosEnRevision: entero(
            resumen.pagosEnRevision,
          ),

          pagosAprobados: entero(
            resumen.pagosAprobados,
          ),

          pagosRechazados: entero(
            resumen.pagosRechazados,
          ),

          pagosCancelados: entero(
            resumen.pagosCancelados,
          ),
        },

        tendencias: {
          usuariosNuevos:
            crearTendencia(
              usuariosActual,
              usuariosAnterior,
            ),

          inscripciones:
            crearTendencia(
              inscripcionesActual,
              inscripcionesAnterior,
            ),

          ingresos:
            crearTendencia(
              ingresosActual,
              ingresosAnterior,
            ),
        },

        cursosRecientes: obtenerFilas(
          cursosRecientesResult,
        ).map((curso) => ({
          idCurso: entero(
            curso.idCurso,
          ),

          tituloCurso: texto(
            curso.tituloCurso,
            "Curso sin título",
          ),

          instructor: texto(
            curso.instructor,
            "Sin instructor",
          ),

          categoria: texto(
            curso.categoria,
            "Sin categoría",
          ),

          modalidad: texto(
            curso.modalidad,
            "Sin modalidad",
          ),

          cuposOcupados: entero(
            curso.cuposOcupados,
          ),

          cupoMaximo: entero(
            curso.cupoMaximo,
          ),

          porcentajeOcupacion:
            decimal(
              curso.porcentajeOcupacion,
              1,
            ),

          totalInscripciones: entero(
            curso.totalInscripciones,
          ),

          costo: decimal(
            curso.costo,
          ),

          ingresosAprobados: decimal(
            curso.ingresosAprobados,
          ),

          fechaInicio:
            fechaComoTexto(
              curso.fechaInicio,
            ),

          fechaFin: fechaComoTexto(
            curso.fechaFin,
          ),

          estadoCurso: texto(
            curso.estadoCurso,
            "Sin estado",
          ),

          activo: booleano(
            curso.activo,
          ),
        })),

        usuariosActivos: obtenerFilas(
          usuariosResult,
        ).map((usuario) => ({
          id: entero(usuario.id),

          nombre: texto(
            usuario.nombre,
            "Usuario",
          ),

          apellidoPaterno: texto(
            usuario.apellidoPaterno,
          ),

          apellidoMaterno: texto(
            usuario.apellidoMaterno,
          ),

          correo: texto(
            usuario.correo,
          ),

          telefono: texto(
            usuario.telefono,
          ),

          rol: texto(
            usuario.rol,
            "cliente",
          ),

          activo: booleano(
            usuario.activo,
          ),

          mfaHabilitado: booleano(
            usuario.mfaHabilitado,
          ),

          bloqueadoHasta:
            fechaComoTexto(
              usuario.bloqueadoHasta,
            ),
        })),

        inscripcionesRecientes:
          obtenerFilas(
            inscripcionesResult,
          ).map((inscripcion) => ({
            id: entero(
              inscripcion.id,
            ),

            idCurso: entero(
              inscripcion.idCurso,
            ),

            curso: texto(
              inscripcion.curso,
              "Curso no disponible",
            ),

            usuario: texto(
              inscripcion.usuario,
              "Participante",
            ),

            correo: texto(
              inscripcion.correo,
            ),

            fecha: fechaComoTexto(
              inscripcion.fecha,
            ),

            fechaConfirmacion:
              fechaComoTexto(
                inscripcion.fechaConfirmacion,
              ),

            estado: texto(
              inscripcion.estado,
              "Sin estado",
            ),

            montoPagado: decimal(
              inscripcion.montoPagado,
            ),

            metodoPago: texto(
              inscripcion.metodoPago,
              "No especificado",
            ),

            origenInscripcion: texto(
              inscripcion.origenInscripcion,
              "No especificado",
            ),
          })),

        metricasRapidas: {
          pagosPorValidar: entero(
            alertasConteo.pagosPorValidar,
          ),

          preguntasPendientes: entero(
            alertasConteo.preguntasPendientes,
          ),

          preguntasUrgentes: entero(
            alertasConteo.preguntasUrgentes,
          ),

          cursosBajaOcupacion: entero(
            alertasConteo.cursosBajaOcupacion,
          ),

          cursosCupoCompleto: entero(
            alertasConteo.cursosCupoCompleto,
          ),

          cuentasBloqueadas: entero(
            alertasConteo.cuentasBloqueadas,
          ),

          respaldosFallidos: entero(
            alertasConteo.respaldosFallidos,
          ),

          montoReportado: decimal(
            resumen.montoReportado,
          ),

          montoPorRevisar: decimal(
            resumen.montoPorRevisar,
          ),

          montoRechazado: decimal(
            resumen.montoRechazado,
          ),

          montoCancelado: decimal(
            resumen.montoCancelado,
          ),
        },

        alertas,

        actividadReciente:
          obtenerFilas(
            actividadResult,
          ).map((actividad) => ({
            id: entero(
              actividad.id,
            ),

            usuario: texto(
              actividad.usuario,
              "Sistema",
            ),

            accion: texto(
              actividad.accion,
              "Acción no especificada",
            ),

            modulo: texto(
              actividad.modulo,
              "Sistema",
            ),

            registroId:
              actividad.registroId ===
                null ||
              actividad.registroId ===
                undefined
                ? null
                : entero(
                    actividad.registroId,
                  ),

            fecha: fechaComoTexto(
              actividad.fecha,
            ),

            aplicacionOrigen: texto(
              actividad.aplicacionOrigen,
              "CMP",
            ),
          })),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          Vary: "Cookie",
        },
      },
    );
  } catch (error: unknown) {
    console.error(
      "Error en dashboard admin:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Error al obtener las estadísticas del dashboard.",

        detalle:
          process.env.NODE_ENV ===
            "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      },
    );
  }
}