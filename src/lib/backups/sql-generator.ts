import type postgres from "postgres";

import {
  debeIncluirTabla,
  type TablaBackup,
  type TipoBackup,
} from "./backup-config";

type SqlTransaccion = postgres.TransactionSql;

interface ColumnaTabla {
  nombre: string;
  tipoSql: string;
  esIdentidad: boolean;
  esGenerada: boolean;
}

interface DependenciaTabla {
  esquemaHijo: string;
  tablaHija: string;
  esquemaPadre: string;
  tablaPadre: string;
}

interface SecuenciaTabla {
  esquema: string;
  tabla: string;
  columna: string;
  secuencia: string;
}

interface ResultadoOrdenamiento {
  tablas: TablaBackup[];
  tablasCirculares: TablaBackup[];
}

const TAMAÑO_LOTE_INSERT = 200;

function obtenerClaveTabla(tabla: TablaBackup) {
  return `${tabla.esquema}.${tabla.tabla}`;
}

function citarIdentificador(valor: string) {
  return `"${valor.replace(/"/g, '""')}"`;
}

function citarTabla(esquema: string, tabla: string) {
  return `${citarIdentificador(esquema)}.${citarIdentificador(tabla)}`;
}

function escaparLiteralSql(valor: string) {
  if (valor.includes("\u0000")) {
    throw new Error(
      "No se puede respaldar un texto que contenga caracteres nulos"
    );
  }

  return `'${valor.replace(/'/g, "''")}'`;
}

function convertirValorSql(
  valor: unknown,
  tipoSql: string
): string {
  if (valor === null || valor === undefined) {
    return "NULL";
  }

  /*
   * Todos los valores se consultan previamente como texto.
   * Al restaurarlos se convierten nuevamente a su tipo real:
   *
   * '15'::integer
   * 'true'::boolean
   * '2026-07-19 14:00:00'::timestamp
   * '{"nombre":"curso"}'::jsonb
   */
  const texto = String(valor);

  return `${escaparLiteralSql(texto)}::${tipoSql}`;
}

async function obtenerTablas(
  sql: SqlTransaccion,
  tipo: TipoBackup
): Promise<TablaBackup[]> {
  const filas = await sql<
    {
      table_schema: string;
      table_name: string;
    }[]
  >`
    SELECT
      table_schema,
      table_name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema IN (
        'academia',
        'analitica',
        'auditoria',
        'clinica',
        'seguridad',
        'soporte'
      )
    ORDER BY
      table_schema,
      table_name
  `;

  return filas
    .filter((fila) =>
      debeIncluirTabla(
        fila.table_schema,
        fila.table_name,
        tipo
      )
    )
    .map((fila) => ({
      esquema: fila.table_schema,
      tabla: fila.table_name,
    }));
}

async function obtenerColumnas(
  sql: SqlTransaccion,
  tablasPermitidas: TablaBackup[]
) {
  const clavesPermitidas = new Set(
    tablasPermitidas.map(obtenerClaveTabla)
  );

  const filas = await sql<
    {
      table_schema: string;
      table_name: string;
      column_name: string;
      data_type_sql: string;
      identity_type: string;
      generated_type: string;
    }[]
  >`
    SELECT
      esquema.nspname AS table_schema,
      clase.relname AS table_name,
      atributo.attname AS column_name,

      pg_catalog.format_type(
        atributo.atttypid,
        atributo.atttypmod
      ) AS data_type_sql,

      atributo.attidentity AS identity_type,
      atributo.attgenerated AS generated_type

    FROM pg_catalog.pg_attribute atributo

    INNER JOIN pg_catalog.pg_class clase
      ON clase.oid = atributo.attrelid

    INNER JOIN pg_catalog.pg_namespace esquema
      ON esquema.oid = clase.relnamespace

    WHERE esquema.nspname IN (
      'academia',
      'analitica',
      'auditoria',
      'clinica',
      'seguridad',
      'soporte'
    )
      AND clase.relkind IN ('r', 'p')
      AND atributo.attnum > 0
      AND NOT atributo.attisdropped

    ORDER BY
      esquema.nspname,
      clase.relname,
      atributo.attnum
  `;

  const columnasPorTabla = new Map<
    string,
    ColumnaTabla[]
  >();

  for (const fila of filas) {
    const clave =
      `${fila.table_schema}.${fila.table_name}`;

    if (!clavesPermitidas.has(clave)) {
      continue;
    }

    const columnasActuales =
      columnasPorTabla.get(clave) ?? [];

    columnasActuales.push({
      nombre: fila.column_name,
      tipoSql: fila.data_type_sql,
      esIdentidad: Boolean(fila.identity_type),
      esGenerada: Boolean(fila.generated_type),
    });

    columnasPorTabla.set(clave, columnasActuales);
  }

  return columnasPorTabla;
}

async function obtenerDependencias(
  sql: SqlTransaccion,
  tablasPermitidas: TablaBackup[]
): Promise<DependenciaTabla[]> {
  const clavesPermitidas = new Set(
    tablasPermitidas.map(obtenerClaveTabla)
  );

  const filas = await sql<
    {
      esquema_hijo: string;
      tabla_hija: string;
      esquema_padre: string;
      tabla_padre: string;
    }[]
  >`
    SELECT DISTINCT
      esquema_hijo.nspname AS esquema_hijo,
      tabla_hija.relname AS tabla_hija,
      esquema_padre.nspname AS esquema_padre,
      tabla_padre.relname AS tabla_padre

    FROM pg_catalog.pg_constraint restriccion

    INNER JOIN pg_catalog.pg_class tabla_hija
      ON tabla_hija.oid = restriccion.conrelid

    INNER JOIN pg_catalog.pg_namespace esquema_hijo
      ON esquema_hijo.oid = tabla_hija.relnamespace

    INNER JOIN pg_catalog.pg_class tabla_padre
      ON tabla_padre.oid = restriccion.confrelid

    INNER JOIN pg_catalog.pg_namespace esquema_padre
      ON esquema_padre.oid = tabla_padre.relnamespace

    WHERE restriccion.contype = 'f'

      AND esquema_hijo.nspname IN (
        'academia',
        'analitica',
        'auditoria',
        'clinica',
        'seguridad',
        'soporte'
      )

      AND esquema_padre.nspname IN (
        'academia',
        'analitica',
        'auditoria',
        'clinica',
        'seguridad',
        'soporte'
      )
  `;

  return filas
    .filter((fila) => {
      const claveHija =
        `${fila.esquema_hijo}.${fila.tabla_hija}`;

      const clavePadre =
        `${fila.esquema_padre}.${fila.tabla_padre}`;

      return (
        clavesPermitidas.has(claveHija) &&
        clavesPermitidas.has(clavePadre)
      );
    })
    .map((fila) => ({
      esquemaHijo: fila.esquema_hijo,
      tablaHija: fila.tabla_hija,
      esquemaPadre: fila.esquema_padre,
      tablaPadre: fila.tabla_padre,
    }));
}

/**
 * Ordena primero las tablas padre y posteriormente
 * las tablas que dependen de ellas mediante llaves foráneas.
 */
function ordenarTablasPorDependencias(
  tablas: TablaBackup[],
  dependencias: DependenciaTabla[]
): ResultadoOrdenamiento {
  const tablasPorClave = new Map(
    tablas.map((tabla) => [
      obtenerClaveTabla(tabla),
      tabla,
    ])
  );

  const padresPendientes = new Map<
    string,
    Set<string>
  >();

  const tablasHijas = new Map<
    string,
    Set<string>
  >();

  for (const tabla of tablas) {
    const clave = obtenerClaveTabla(tabla);

    padresPendientes.set(clave, new Set());
    tablasHijas.set(clave, new Set());
  }

  for (const dependencia of dependencias) {
    const claveHija =
      `${dependencia.esquemaHijo}.${dependencia.tablaHija}`;

    const clavePadre =
      `${dependencia.esquemaPadre}.${dependencia.tablaPadre}`;

    /*
     * Las autorreferencias no modifican el orden entre tablas.
     */
    if (claveHija === clavePadre) {
      continue;
    }

    padresPendientes
      .get(claveHija)
      ?.add(clavePadre);

    tablasHijas
      .get(clavePadre)
      ?.add(claveHija);
  }

  const disponibles = Array.from(
    padresPendientes.entries()
  )
    .filter(([, padres]) => padres.size === 0)
    .map(([clave]) => clave)
    .sort();

  const tablasOrdenadas: TablaBackup[] = [];
  const procesadas = new Set<string>();

  while (disponibles.length > 0) {
    const claveActual = disponibles.shift();

    if (!claveActual || procesadas.has(claveActual)) {
      continue;
    }

    const tablaActual =
      tablasPorClave.get(claveActual);

    if (!tablaActual) {
      continue;
    }

    procesadas.add(claveActual);
    tablasOrdenadas.push(tablaActual);

    const hijas =
      tablasHijas.get(claveActual) ??
      new Set<string>();

    for (const claveHija of hijas) {
      const padres =
        padresPendientes.get(claveHija);

      padres?.delete(claveActual);

      if (padres?.size === 0) {
        disponibles.push(claveHija);
        disponibles.sort();
      }
    }
  }

  /*
   * Las relaciones circulares no pueden ordenarse
   * completamente. Se agregan al final y se reportan.
   */
  const tablasCirculares = tablas
    .filter(
      (tabla) =>
        !procesadas.has(obtenerClaveTabla(tabla))
    )
    .sort((tablaA, tablaB) =>
      obtenerClaveTabla(tablaA).localeCompare(
        obtenerClaveTabla(tablaB)
      )
    );

  return {
    tablas: [
      ...tablasOrdenadas,
      ...tablasCirculares,
    ],
    tablasCirculares,
  };
}

function crearConsultaDatos(
  tabla: TablaBackup,
  columnas: ColumnaTabla[]
) {
  /*
   * Las columnas generadas automáticamente no deben
   * aparecer en un INSERT.
   */
  const columnasInsertables = columnas.filter(
    (columna) => !columna.esGenerada
  );

  if (columnasInsertables.length === 0) {
    return {
      columnasInsertables,
      consulta: null,
    };
  }

  const columnasSelect = columnasInsertables
    .map((columna, indice) => {
      const nombre = citarIdentificador(
        columna.nombre
      );

      const alias = citarIdentificador(
        `__columna_${indice}`
      );

      /*
       * Convertimos temporalmente cada dato a texto.
       * Esto permite conservar números grandes, UUID,
       * arreglos, JSON, fechas, intervalos y bytea.
       */
      return `${nombre}::text AS ${alias}`;
    })
    .join(",\n");

  const consulta = `
    SELECT
      ${columnasSelect}
    FROM ${citarTabla(
      tabla.esquema,
      tabla.tabla
    )}
  `;

  return {
    columnasInsertables,
    consulta,
  };
}

function crearInsertLote({
  tabla,
  columnas,
  filas,
}: {
  tabla: TablaBackup;
  columnas: ColumnaTabla[];
  filas: Record<string, unknown>[];
}) {
  if (filas.length === 0) {
    return "";
  }

  const nombresColumnas = columnas
    .map((columna) =>
      citarIdentificador(columna.nombre)
    )
    .join(", ");

  const contieneIdentidad = columnas.some(
    (columna) => columna.esIdentidad
  );

  const valores = filas
    .map((fila) => {
      const valoresFila = columnas.map(
        (columna, indice) =>
          convertirValorSql(
            fila[`__columna_${indice}`],
            columna.tipoSql
          )
      );

      return `(${valoresFila.join(", ")})`;
    })
    .join(",\n");

  return [
    `INSERT INTO ${citarTabla(
      tabla.esquema,
      tabla.tabla
    )} (${nombresColumnas})`,

    contieneIdentidad
      ? "OVERRIDING SYSTEM VALUE"
      : null,

    "VALUES",
    `${valores};`,
    "",
  ]
    .filter(
      (linea): linea is string =>
        typeof linea === "string"
    )
    .join("\n");
}

async function generarInsertsTabla({
  sql,
  tabla,
  columnas,
}: {
  sql: SqlTransaccion;
  tabla: TablaBackup;
  columnas: ColumnaTabla[];
}) {
  const {
    columnasInsertables,
    consulta,
  } = crearConsultaDatos(tabla, columnas);

  const claveTabla = obtenerClaveTabla(tabla);

  if (!consulta || columnasInsertables.length === 0) {
    return {
      contenido: [
        `-- Tabla: ${claveTabla}`,
        "-- No contiene columnas insertables.",
        "",
      ].join("\n"),
      totalRegistros: 0,
    };
  }

  /*
   * La consulta se construye únicamente con nombres de
   * esquemas, tablas y columnas obtenidos de PostgreSQL.
   * Todos los identificadores se citan de forma segura.
   */
  const filas = await sql.unsafe<
    Record<string, string | null>[]
  >(consulta);

  const secciones: string[] = [
    "-- ----------------------------------------------------",
    `-- Tabla: ${claveTabla}`,
    `-- Registros: ${filas.length}`,
    "-- ----------------------------------------------------",
    "",
  ];

  if (filas.length === 0) {
    secciones.push(
      "-- La tabla no contiene registros.",
      ""
    );

    return {
      contenido: secciones.join("\n"),
      totalRegistros: 0,
    };
  }

  for (
    let indice = 0;
    indice < filas.length;
    indice += TAMAÑO_LOTE_INSERT
  ) {
    const lote = filas.slice(
      indice,
      indice + TAMAÑO_LOTE_INSERT
    );

    secciones.push(
      crearInsertLote({
        tabla,
        columnas: columnasInsertables,
        filas: lote,
      })
    );
  }

  return {
    contenido: secciones.join("\n"),
    totalRegistros: filas.length,
  };
}

async function obtenerSecuencias(
  sql: SqlTransaccion,
  tablasPermitidas: TablaBackup[]
): Promise<SecuenciaTabla[]> {
  const clavesPermitidas = new Set(
    tablasPermitidas.map(obtenerClaveTabla)
  );

  const filas = await sql<
    {
      table_schema: string;
      table_name: string;
      column_name: string;
      sequence_name: string;
    }[]
  >`
    SELECT
      resultado.table_schema,
      resultado.table_name,
      resultado.column_name,
      resultado.sequence_name

    FROM (
      SELECT
        esquema.nspname AS table_schema,
        clase.relname AS table_name,
        atributo.attname AS column_name,

        pg_get_serial_sequence(
          format(
            '%I.%I',
            esquema.nspname,
            clase.relname
          ),
          atributo.attname
        ) AS sequence_name

      FROM pg_catalog.pg_attribute atributo

      INNER JOIN pg_catalog.pg_class clase
        ON clase.oid = atributo.attrelid

      INNER JOIN pg_catalog.pg_namespace esquema
        ON esquema.oid = clase.relnamespace

      WHERE esquema.nspname IN (
        'academia',
        'analitica',
        'auditoria',
        'clinica',
        'seguridad',
        'soporte'
      )
        AND clase.relkind IN ('r', 'p')
        AND atributo.attnum > 0
        AND NOT atributo.attisdropped
    ) resultado

    WHERE resultado.sequence_name IS NOT NULL

    ORDER BY
      resultado.table_schema,
      resultado.table_name,
      resultado.column_name
  `;

  return filas
    .filter((fila) =>
      clavesPermitidas.has(
        `${fila.table_schema}.${fila.table_name}`
      )
    )
    .map((fila) => ({
      esquema: fila.table_schema,
      tabla: fila.table_name,
      columna: fila.column_name,
      secuencia: fila.sequence_name,
    }));
}

function generarSqlSecuencias(
  secuencias: SecuenciaTabla[]
) {
  if (secuencias.length === 0) {
    return "-- No se detectaron secuencias.";
  }

  return secuencias
    .map((secuencia) => {
      const tabla = citarTabla(
        secuencia.esquema,
        secuencia.tabla
      );

      const columna = citarIdentificador(
        secuencia.columna
      );

      const secuenciaSql = escaparLiteralSql(
        secuencia.secuencia
      );

      /*
       * Si hay registros:
       * la siguiente secuencia será MAX(id) + 1.
       *
       * Si la tabla está vacía:
       * la siguiente secuencia será 1.
       */
      return [
        "SELECT setval(",
        `  ${secuenciaSql}::regclass,`,
        `  COALESCE(MAX(${columna}), 1),`,
        `  MAX(${columna}) IS NOT NULL`,
        ")",
        `FROM ${tabla};`,
      ].join("\n");
    })
    .join("\n\n");
}

function generarEncabezado({
  tipo,
  totalTablas,
  tablasCirculares,
}: {
  tipo: TipoBackup;
  totalTablas: number;
  tablasCirculares: TablaBackup[];
}) {
  const encabezado = [
    "-- ====================================================",
    "-- RESPALDO DE DATOS",
    "-- CENTRO MÉDICO PICHARDO",
    "-- ====================================================",
    `-- Tipo de respaldo: ${tipo}`,
    `-- Fecha UTC: ${new Date().toISOString()}`,
    `-- Tablas incluidas: ${totalTablas}`,
    "--",
    "-- IMPORTANTE:",
    "-- Este archivo contiene los datos de las tablas.",
    "-- La estructura, funciones, vistas y restricciones",
    "-- deben existir antes de realizar la restauración.",
    "--",
    "-- Se recomienda restaurar en tablas vacías.",
    "-- Este archivo NO elimina datos existentes.",
    "-- ====================================================",
    "",
  ];

  if (tablasCirculares.length > 0) {
    encabezado.push(
      "-- ADVERTENCIA:",
      "-- Se detectaron dependencias circulares en:",
      ...tablasCirculares.map(
        (tabla) =>
          `--   ${obtenerClaveTabla(tabla)}`
      ),
      "-- Estas tablas requerirán atención al restaurarse.",
      ""
    );
  }

  encabezado.push(
    "BEGIN;",
    "",
    "SET client_encoding = 'UTF8';",
    "SET standard_conforming_strings = on;",
    "SET DateStyle = 'ISO, YMD';",
    "SET TIME ZONE 'UTC';",
    ""
  );

  return encabezado.join("\n");
}

export async function generarSqlBackup(
  sql: SqlTransaccion,
  tipo: TipoBackup
) {
  console.log("[BACKUP][SQL] Iniciando generación", {
    tipo,
  });

  /*
   * Asegura formatos consistentes al convertir fechas
   * y horas a texto durante esta transacción.
   */
  await sql.unsafe(
    "SET LOCAL TIME ZONE 'UTC'"
  );

  await sql.unsafe(
    "SET LOCAL DateStyle = 'ISO, YMD'"
  );

  const tablasEncontradas =
    await obtenerTablas(sql, tipo);

  if (tablasEncontradas.length === 0) {
    throw new Error(
      "No se encontraron tablas para generar el respaldo"
    );
  }

  const [
    columnasPorTabla,
    dependencias,
  ] = await Promise.all([
    obtenerColumnas(sql, tablasEncontradas),
    obtenerDependencias(sql, tablasEncontradas),
  ]);

  const resultadoOrdenamiento =
    ordenarTablasPorDependencias(
      tablasEncontradas,
      dependencias
    );

  const tablasOrdenadas =
    resultadoOrdenamiento.tablas;

  console.log("[BACKUP][SQL] Tablas incluidas", {
    tipo,
    total: tablasOrdenadas.length,
    tablas: tablasOrdenadas.map(
      obtenerClaveTabla
    ),
  });

  if (
    resultadoOrdenamiento.tablasCirculares.length > 0
  ) {
    console.warn(
      "[BACKUP][SQL] Dependencias circulares:",
      resultadoOrdenamiento.tablasCirculares.map(
        obtenerClaveTabla
      )
    );
  }

  const esquemasSql = Array.from(
    new Set(
      tablasOrdenadas.map(
        (tabla) => tabla.esquema
      )
    )
  )
    .sort()
    .map(
      (esquema) =>
        `CREATE SCHEMA IF NOT EXISTS ${citarIdentificador(
          esquema
        )};`
    )
    .join("\n");

  const seccionesDatos: string[] = [];
  let totalRegistros = 0;

  for (const tabla of tablasOrdenadas) {
    const clave = obtenerClaveTabla(tabla);

    console.log(
      `[BACKUP][SQL] Procesando ${clave}`
    );

    const columnas =
      columnasPorTabla.get(clave) ?? [];

    if (columnas.length === 0) {
      console.warn(
        `[BACKUP][SQL] No se encontraron columnas para ${clave}`
      );
    }

    const resultadoTabla =
      await generarInsertsTabla({
        sql,
        tabla,
        columnas,
      });

    totalRegistros +=
      resultadoTabla.totalRegistros;

    seccionesDatos.push(
      resultadoTabla.contenido
    );
  }

  const secuencias = await obtenerSecuencias(
    sql,
    tablasOrdenadas
  );

  const encabezado = generarEncabezado({
    tipo,
    totalTablas: tablasOrdenadas.length,
    tablasCirculares:
      resultadoOrdenamiento.tablasCirculares,
  });

  const contenidoSql = [
    encabezado,
    "-- Creación de esquemas faltantes",
    esquemasSql,
    "",
    "-- Datos",
    seccionesDatos.join("\n"),
    "",
    "-- Ajuste de secuencias SERIAL e IDENTITY",
    generarSqlSecuencias(secuencias),
    "",
    "COMMIT;",
    "",
    "-- Fin del respaldo",
    "",
  ].join("\n");

  const tamañoBytes = Buffer.byteLength(
    contenidoSql,
    "utf8"
  );

  console.log("[BACKUP][SQL] Generación terminada", {
    tipo,
    totalTablas: tablasOrdenadas.length,
    totalRegistros,
    tamañoBytes,
  });

  return {
    sql: contenidoSql,
    totalTablas: tablasOrdenadas.length,
    totalRegistros,
    tamañoBytes,
    tablas: tablasOrdenadas,
    tablasCirculares:
      resultadoOrdenamiento.tablasCirculares,
  };
}