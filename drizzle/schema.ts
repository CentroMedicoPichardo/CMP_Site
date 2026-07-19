import { pgTable, pgSchema, index,customType, foreignKey, serial, integer, varchar, text, boolean, timestamp, date, numeric, jsonb, unique, inet, check, uniqueIndex, bigserial, smallint, smallserial, bigint, time } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const soporte = pgSchema("soporte");
export const seguridad = pgSchema("seguridad");
export const clinica = pgSchema("clinica");
export const academia = pgSchema("academia");
export const auditoria = pgSchema("auditoria");
export const analitica = pgSchema("analitica");

export const seqFolioCompraInAcademia = academia.sequence("seq_folio_compra", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

const bytea = customType<{
  data: Buffer;
  driverData: Buffer;
}>({
  dataType() {
    return "bytea";
  },
});

export const preguntasUsuariosInSoporte = soporte.table("preguntas_usuarios", {
	idPregunta: serial("id_pregunta").primaryKey().notNull(),
	idUsuario: integer("id_usuario").notNull(),
	idCategoria: integer("id_categoria"),
	titulo: varchar({ length: 300 }).notNull(),
	descripcion: text().notNull(),
	estado: varchar({ length: 20 }).default('pendiente'),
	prioridad: varchar({ length: 10 }).default('normal'),
	esPrivada: boolean("es_privada").default(false),
	idPreguntaFaq: integer("id_pregunta_faq"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_preguntas_usuarios_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_preguntas_usuarios_fecha").using("btree", table.createdAt.desc().nullsFirst().op("timestamp_ops")),
	index("idx_preguntas_usuarios_usuario").using("btree", table.idUsuario.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.idCategoria],
			foreignColumns: [categoriasAyudaInSoporte.idCategoria],
			name: "fk_pregunta_usuario_categoria"
		}),
	foreignKey({
			columns: [table.idPreguntaFaq],
			foreignColumns: [preguntasFrecuentesInSoporte.idPregunta],
			name: "fk_pregunta_usuario_faq"
		}),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_pregunta_usuario_usuario"
		}),
]);

export const estadisticasConsumoInSeguridad = seguridad.table("estadisticas_consumo", {
	idEstadistica: serial("id_estadistica").primaryKey().notNull(),
	fecha: date().default(sql`CURRENT_DATE`),
	hora: integer(),
	totalConsultas: integer("total_consultas"),
	consultasLentas: integer("consultas_lentas"),
	erroresSql: integer("errores_sql"),
	usuariosActivos: integer("usuarios_activos"),
	anchoBandaMb: numeric("ancho_banda_mb", { precision: 10, scale:  2 }),
	operacionesCrud: jsonb("operaciones_crud"),
});

export const publicacionesInAcademia = academia.table("publicaciones", {
	idPublicacion: serial("id_publicacion").primaryKey().notNull(),
	tituloNoticia: varchar("titulo_noticia", { length: 255 }).notNull(),
	resumenBajada: text("resumen_bajada"),
	idAutor: integer("id_autor"),
	fechaPublicacion: date("fecha_publicacion").default(sql`CURRENT_DATE`),
	etiquetas: text(),
	urlImagen: text("url_imagen"),
	contenidoCompleto: text("contenido_completo"),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idAutor],
			foreignColumns: [medicosInClinica.idMedico],
			name: "publicaciones_id_autor_fkey"
		}),
]);

export const rolesInSeguridad = seguridad.table("roles", {
	id: serial().primaryKey().notNull(),
	nombre: text().notNull(),
}, (table) => [
	unique("roles_nombre_unique").on(table.nombre),
]);

export const intentosRecuperacionInAuditoria = auditoria.table("intentos_recuperacion", {
	id: serial().primaryKey().notNull(),
	identificador: text().notNull(),
	conteo: integer().default(0),
	ultimoIntento: timestamp("ultimo_intento", { mode: 'string' }).defaultNow(),
	bloqueadoHasta: timestamp("bloqueado_hasta", { mode: 'string' }),
});

export const usuariosInSeguridad = seguridad.table("usuarios", {
	id: serial().primaryKey().notNull(),
	nombre: text().notNull(),
	apellidoPaterno: text().notNull(),
	apellidoMaterno: text(),
	edad: integer().notNull(),
	sexo: text().notNull(),
	telefono: text().notNull(),
	correo: text().notNull(),
	contrasena: text().notNull(),
	rolId: integer("rol_id").notNull(),
	resetToken: text("reset_token"),
	resetTokenExpiry: timestamp("reset_token_expiry", { mode: 'string' }),
	intentosFallidos: integer("intentos_fallidos").default(0),
	bloqueadoHasta: timestamp("bloqueado_hasta", { mode: 'string' }),
	versionToken: integer("version_token").default(1),
	mfaHabilitado: boolean("mfa_habilitado").default(false),
	secretoMfa: text("secreto_mfa"),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.rolId],
			foreignColumns: [rolesInSeguridad.id],
			name: "usuarios_rol_id_roles_id_fk"
		}),
	unique("usuarios_correo_unique").on(table.correo),
]);

export const monitoreoRendimientoInSeguridad = seguridad.table("monitoreo_rendimiento", {
	idMonitoreo: serial("id_monitoreo").primaryKey().notNull(),
	fechaHora: timestamp("fecha_hora", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	queryText: text("query_text"),
	tiempoEjecucionMs: integer("tiempo_ejecucion_ms"),
	cpuUsagePercent: numeric("cpu_usage_percent", { precision: 5, scale:  2 }),
	memoriaUsageMb: integer("memoria_usage_mb"),
	conexionesActivas: integer("conexiones_activas"),
	deadlocksDetectados: integer("deadlocks_detectados"),
	cacheHitRatio: numeric("cache_hit_ratio", { precision: 5, scale:  2 }),
	tablaConsultada: varchar("tabla_consultada", { length: 100 }),
});

export const auditoriaAccionesInSeguridad = seguridad.table("auditoria_acciones", {
	idAuditoria: serial("id_auditoria").primaryKey().notNull(),
	usuario: varchar({ length: 100 }),
	ipAddress: inet("ip_address"),
	accion: varchar({ length: 50 }),
	tablaAfectada: varchar("tabla_afectada", { length: 100 }),
	registroId: integer("registro_id"),
	datosAnteriores: jsonb("datos_anteriores"),
	datosNuevos: jsonb("datos_nuevos"),
	fechaHora: timestamp("fecha_hora", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	aplicacionOrigen: varchar("aplicacion_origen", { length: 100 }),
	sessionId: varchar("session_id", { length: 100 }),
});

export const alertasSeguridadInSeguridad = seguridad.table("alertas_seguridad", {
	idAlerta: serial("id_alerta").primaryKey().notNull(),
	tipoAlerta: varchar("tipo_alerta", { length: 50 }),
	nivelCritico: varchar("nivel_critico", { length: 20 }),
	mensaje: text(),
	detalle: jsonb(),
	fechaDeteccion: timestamp("fecha_deteccion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	fechaResolucion: timestamp("fecha_resolucion", { mode: 'string' }),
	estado: varchar({ length: 20 }).default('PENDIENTE'),
	usuarioAsignado: varchar("usuario_asignado", { length: 100 }),
});

export const cambiosEstructuraInSeguridad = seguridad.table("cambios_estructura", {
	idCambio: serial("id_cambio").primaryKey().notNull(),
	usuario: varchar({ length: 100 }),
	fechaCambio: timestamp("fecha_cambio", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	tipoObjeto: varchar("tipo_objeto", { length: 20 }),
	nombreObjeto: varchar("nombre_objeto", { length: 100 }),
	sentenciaDdl: text("sentencia_ddl"),
	cambioDetalle: jsonb("cambio_detalle"),
});

export const nosotrosInClinica = clinica.table("nosotros", {
	id: serial().primaryKey().notNull(),
	mision: text().notNull(),
	vision: text().notNull(),
	valores: text().array().notNull(),
	nuestraHistoria: text("nuestra_historia").notNull(),
	compromiso: text().notNull(),
	urlImagen: text("url_imagen").default('/pediatric-illustration.png'),
});

export const respuestasAyudaInSoporte = soporte.table("respuestas_ayuda", {
	idRespuesta: serial("id_respuesta").primaryKey().notNull(),
	idPregunta: integer("id_pregunta").notNull(),
	idUsuario: integer("id_usuario").notNull(),
	contenido: text().notNull(),
	esRespuestaAdmin: boolean("es_respuesta_admin").default(false),
	esSolucion: boolean("es_solucion").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_respuestas_fecha").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_respuestas_pregunta").using("btree", table.idPregunta.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.idPregunta],
			foreignColumns: [preguntasUsuariosInSoporte.idPregunta],
			name: "fk_respuesta_pregunta"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_respuesta_usuario"
		}),
]);

export const instructoresInAcademia = academia.table("instructores", {
	idInstructor: serial("id_instructor").primaryKey().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	apellidoPaterno: varchar("apellido_paterno", { length: 100 }).notNull(),
	apellidoMaterno: varchar("apellido_materno", { length: 100 }),
	especialidad: varchar({ length: 100 }).notNull(),
	edad: integer().notNull(),
	telefono: varchar({ length: 20 }),
	correo: varchar({ length: 150 }).notNull(),
	direccion: text(),
	activo: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_instructores_activo").using("btree", table.activo.asc().nullsLast().op("bool_ops")),
	index("idx_instructores_especialidad").using("btree", table.especialidad.asc().nullsLast().op("text_ops")),
	unique("instructores_correo_key").on(table.correo),
]);

export const categoriasCursosInAcademia = academia.table("categorias_cursos", {
	idCategoria: serial("id_categoria").primaryKey().notNull(),
	nombreCategoria: varchar("nombre_categoria", { length: 50 }).notNull(),
	descripcion: text(),
	activo: boolean().default(true),
}, (table) => [
	unique("categorias_cursos_nombre_categoria_key").on(table.nombreCategoria),
]);

export const ubicacionesCursosInAcademia = academia.table("ubicaciones_cursos", {
	idUbicacion: serial("id_ubicacion").primaryKey().notNull(),
	nombreUbicacion: varchar("nombre_ubicacion", { length: 150 }).notNull(),
	direccionCompleta: text("direccion_completa"),
	capacidadMaxima: integer("capacidad_maxima"),
	activo: boolean().default(true),
}, (table) => [
	unique("ubicaciones_cursos_nombre_ubicacion_key").on(table.nombreUbicacion),
]);

export const modalidadesInAcademia = academia.table("modalidades", {
	idModalidad: serial("id_modalidad").primaryKey().notNull(),
	nombreModalidad: varchar("nombre_modalidad", { length: 20 }).notNull(),
	descripcion: text(),
}, (table) => [
	unique("modalidades_nombre_modalidad_key").on(table.nombreModalidad),
]);

export const cursosInAcademia = academia.table("cursos", {
	idCurso: serial("id_curso").primaryKey().notNull(),
	tituloCurso: varchar("titulo_curso", { length: 200 }).notNull(),
	descripcion: text(),
	idInstructor: integer("id_instructor").notNull(),
	idCategoria: integer("id_categoria").notNull(),
	idUbicacion: integer("id_ubicacion"),
	idModalidad: integer("id_modalidad").notNull(),
	fechaInicio: date("fecha_inicio").notNull(),
	fechaFin: date("fecha_fin").notNull(),
	horario: varchar({ length: 50 }),
	dirigidoA: varchar("dirigido_a", { length: 50 }),
	cupoMaximo: integer("cupo_maximo").notNull(),
	costo: numeric({ precision: 10, scale:  2 }).default('0.00'),
	urlImagenPortada: text("url_imagen_portada"),
	activo: boolean().default(true),
	cuposOcupados: integer("cupos_ocupados").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_cursos_activo").using("btree", table.activo.asc().nullsLast().op("bool_ops")),
	index("idx_cursos_categoria").using("btree", table.idCategoria.asc().nullsLast().op("int4_ops")),
	index("idx_cursos_dirigido_a").using("btree", table.dirigidoA.asc().nullsLast().op("text_ops")),
	index("idx_cursos_fechas").using("btree", table.fechaInicio.asc().nullsLast().op("date_ops"), table.fechaFin.asc().nullsLast().op("date_ops")),
	index("idx_cursos_instructor").using("btree", table.idInstructor.asc().nullsLast().op("int4_ops")),
	index("idx_cursos_modalidad").using("btree", table.idModalidad.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.idCategoria],
			foreignColumns: [categoriasCursosInAcademia.idCategoria],
			name: "fk_cursos_categoria"
		}),
	foreignKey({
			columns: [table.idInstructor],
			foreignColumns: [instructoresInAcademia.idInstructor],
			name: "fk_cursos_instructor"
		}),
	foreignKey({
			columns: [table.idModalidad],
			foreignColumns: [modalidadesInAcademia.idModalidad],
			name: "fk_cursos_modalidad"
		}),
	foreignKey({
			columns: [table.idUbicacion],
			foreignColumns: [ubicacionesCursosInAcademia.idUbicacion],
			name: "fk_cursos_ubicacion"
		}),
	check("check_cupos", sql`cupos_ocupados <= cupo_maximo`),
	check("check_fechas", sql`fecha_fin >= fecha_inicio`),
	check("cursos_costo_check", sql`costo >= (0)::numeric`),
	check("cursos_cupo_maximo_check", sql`cupo_maximo > 0`),
	check("cursos_cupos_ocupados_check", sql`cupos_ocupados >= 0`),
]);

export const medicosInClinica = clinica.table("medicos", {
	idMedico: serial("id_medico").primaryKey().notNull(),
	nombres: varchar({ length: 100 }).notNull(),
	apellidoPaterno: varchar("apellido_paterno", { length: 100 }).notNull(),
	apellidoMaterno: varchar("apellido_materno", { length: 100 }),
	especialidad: varchar({ length: 100 }),
	hospitalClinica: varchar("hospital_clinica", { length: 150 }),
	direccion: text(),
	urlFoto: varchar("url_foto", { length: 255 }),
	activo: boolean().default(true),
});

export const serviciosInClinica = clinica.table("servicios", {
	idServicio: serial("id_servicio").primaryKey().notNull(),
	tituloServicio: varchar("titulo_servicio", { length: 150 }).notNull(),
	descripcion: text(),
	ubicacion: varchar({ length: 200 }),
	urlImage: text("url_image"),
	textoAlt: varchar("texto_alt", { length: 150 }),
	disenoTipo: varchar("diseno_tipo", { length: 20 }).default('vertical'),
	activo: boolean().default(true),
});

export const categoriasAyudaInSoporte = soporte.table("categorias_ayuda", {
	idCategoria: serial("id_categoria").primaryKey().notNull(),
	nombreCategoria: varchar("nombre_categoria", { length: 100 }).notNull(),
	descripcion: text(),
	icono: varchar({ length: 50 }),
	orden: integer().default(0),
	activo: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_categorias_ayuda_orden").using("btree", table.orden.asc().nullsLast().op("int4_ops")),
	unique("categorias_ayuda_nombre_key").on(table.nombreCategoria),
]);

export const preguntasFrecuentesInSoporte = soporte.table("preguntas_frecuentes", {
	idPregunta: serial("id_pregunta").primaryKey().notNull(),
	idCategoria: integer("id_categoria").notNull(),
	pregunta: varchar({ length: 500 }).notNull(),
	respuesta: text().notNull(),
	orden: integer().default(0),
	vecesUtil: integer("veces_util").default(0),
	vecesNoUtil: integer("veces_no_util").default(0),
	activo: boolean().default(true),
	esDestacada: boolean("es_destacada").default(false),
	tags: text().array(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	creadoPor: integer("creado_por"),
}, (table) => [
	index("idx_preguntas_frecuentes_categoria").using("btree", table.idCategoria.asc().nullsLast().op("int4_ops")),
	index("idx_preguntas_frecuentes_destacada").using("btree", table.esDestacada.asc().nullsLast().op("bool_ops")),
	index("idx_preguntas_frecuentes_orden").using("btree", table.orden.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.idCategoria],
			foreignColumns: [categoriasAyudaInSoporte.idCategoria],
			name: "fk_pregunta_frecuente_categoria"
		}),
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_pregunta_frecuente_creador"
		}),
]);

export const academiaInfantilInAcademia = academia.table("academia_infantil", {
	idGuia: serial("id_guia").primaryKey().notNull(),
	tituloGuia: varchar("titulo_guia", { length: 255 }).notNull(),
	descripcionCorta: text("descripcion_corta"),
	idAutor: integer("id_autor"),
	fechaPublicacion: date("fecha_publicacion").default(sql`CURRENT_DATE`),
	urlImagen: text("url_imagen"),
	etiquetas: text(),
	descripcionLarga: text("descripcion_larga"),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idAutor],
			foreignColumns: [medicosInClinica.idMedico],
			name: "academia_infantil_id_autor_fkey"
		}),
]);

export const empresaInfoInClinica = clinica.table("empresa_info", {
	id: serial().primaryKey().notNull(),
	nombre: varchar({ length: 150 }).notNull(),
	direccion: text().notNull(),
	telefono: varchar({ length: 20 }).notNull(),
	correo: varchar({ length: 150 }).notNull(),
	facebook: varchar({ length: 150 }),
	instagram: varchar({ length: 150 }),
	horario: text().notNull(),
	logoUrl: text("logo_url"),
	correoSoporte: varchar("correo_soporte", { length: 150 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const respuestasEncuestasInAcademia = academia.table("respuestas_encuestas", {
	id: serial().primaryKey().notNull(),
	encuestaId: integer("encuesta_id"),
	usuarioId: integer("usuario_id"),
	respuestas: jsonb(),
	fechaRespuesta: timestamp("fecha_respuesta", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.encuestaId],
			foreignColumns: [encuestasInAcademia.id],
			name: "respuestas_encuestas_encuesta_id_fkey"
		}),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "respuestas_encuestas_usuario_id_fkey"
		}),
]);

export const contenidoSaberPediatricoInAcademia = academia.table("contenido_saber_pediatrico", {
	id: serial().primaryKey().notNull(),
	tipo: varchar({ length: 20 }).notNull(),
	titulo: varchar({ length: 255 }).notNull(),
	descripcion: text(),
	contenido: text(),
	urlExterno: text("url_externo"),
	imagenUrl: text("imagen_url"),
	videoUrl: text("video_url"),
	archivoUrl: text("archivo_url"),
	categoria: varchar({ length: 50 }),
	etiquetas: text().array(),
	duracion: varchar({ length: 20 }),
	fechaPublicacion: date("fecha_publicacion").default(sql`CURRENT_DATE`),
	destacado: boolean().default(false),
	orden: integer().default(0),
	activo: boolean().default(true),
	visualizaciones: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const encuestasInAcademia = academia.table("encuestas", {
	id: serial().primaryKey().notNull(),
	contenidoId: integer("contenido_id"),
	preguntas: jsonb(),
	fechaInicio: date("fecha_inicio"),
	fechaFin: date("fecha_fin"),
	totalParticipantes: integer("total_participantes").default(0),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.contenidoId],
			foreignColumns: [contenidoSaberPediatricoInAcademia.id],
			name: "encuestas_contenido_id_fkey"
		}),
]);

export const valoracionesFaqInSoporte = soporte.table("valoraciones_faq", {
	idValoracion: serial("id_valoracion").primaryKey().notNull(),
	idPreguntaFaq: integer("id_pregunta_faq").notNull(),
	idUsuario: integer("id_usuario").notNull(),
	esUtil: boolean("es_util").notNull(),
	comentario: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.idPreguntaFaq],
			foreignColumns: [preguntasFrecuentesInSoporte.idPregunta],
			name: "fk_valoracion_faq"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_valoracion_usuario"
		}),
	unique("unique_valoracion_usuario_faq").on(table.idPreguntaFaq, table.idUsuario),
]);

export const comprascursosinacademiaInAcademia = academia.table(
  "comprascursosinacademia",
  {
    idcompra: bigserial({ mode: "bigint" })
      .primaryKey()
      .notNull(),

    foliocompra: varchar({ length: 20 })
      .default(sql`academia.generar_folio_compra()`)
      .notNull(),

    idusuario: integer().notNull(),
    idcurso: integer().notNull(),
    idestadocompra: smallint().notNull(),
    cantidadcupos: smallint().notNull(),

    preciounitario: numeric({
      precision: 10,
      scale: 2,
    }).notNull(),

    subtotal: numeric({
      precision: 10,
      scale: 2,
    }).notNull(),

    descuento: numeric({
      precision: 10,
      scale: 2,
    })
      .default("0")
      .notNull(),

    total: numeric({
      precision: 10,
      scale: 2,
    }).notNull(),

    fechacompra: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    fechalimitepago: timestamp({ mode: "string" }).notNull(),
    fechapago: timestamp({ mode: "string" }),
    fechavalidacion: timestamp({ mode: "string" }),

    usuariovalida: integer(),
    observaciones: text(),
  },
  (table) => [
    index("idx_compra_curso").using(
      "btree",
      table.idcurso.asc().nullsLast().op("int4_ops"),
    ),

    index("idx_compra_estado").using(
      "btree",
      table.idestadocompra.asc().nullsLast().op("int2_ops"),
    ),

    index("idx_compra_fecha").using(
      "btree",
      table.fechacompra.asc().nullsLast().op("timestamp_ops"),
    ),

    index("idx_compra_usuario").using(
      "btree",
      table.idusuario.asc().nullsLast().op("int4_ops"),
    ),

    index("idx_compras_cursos_curso").using(
      "btree",
      table.idcurso.asc().nullsLast().op("int4_ops"),
    ),

    index("idx_compras_cursos_curso_estado").using(
      "btree",
      table.idcurso.asc().nullsLast().op("int4_ops"),
      table.idestadocompra.asc().nullsLast().op("int2_ops"),
    ),

    index("idx_compras_cursos_estado").using(
      "btree",
      table.idestadocompra.asc().nullsLast().op("int2_ops"),
    ),

    index("idx_compras_cursos_fecha").using(
      "btree",
      table.fechacompra.asc().nullsLast().op("timestamp_ops"),
    ),

    index("idx_compras_cursos_limite_pago")
      .using(
        "btree",
        table.fechalimitepago.asc().nullsLast().op("timestamp_ops"),
        table.idcompra.asc().nullsLast().op("int8_ops"),
      )
      .where(sql`${table.fechalimitepago} IS NOT NULL`),

    index("idx_compras_cursos_usuario").using(
      "btree",
      table.idusuario.asc().nullsLast().op("int4_ops"),
    ),

    index("idx_compras_cursos_usuario_fecha").using(
      "btree",
      table.idusuario.asc().nullsLast().op("int4_ops"),
      table.fechacompra.desc().nullsFirst().op("timestamp_ops"),
    ),

    uniqueIndex("uq_compras_cursos_folio").using(
      "btree",
      table.foliocompra.asc().nullsLast().op("text_ops"),
    ),

    foreignKey({
      columns: [table.usuariovalida],
      foreignColumns: [usuariosInSeguridad.id],
      name: "fk_compra_admin",
    }),

    foreignKey({
      columns: [table.idcurso],
      foreignColumns: [cursosInAcademia.idCurso],
      name: "fk_compra_curso",
    }),

    foreignKey({
      columns: [table.idestadocompra],
      foreignColumns: [
        estadocomprainacademiaInAcademia.idestadocompra,
      ],
      name: "fk_compra_estado",
    }),

    foreignKey({
      columns: [table.idusuario],
      foreignColumns: [usuariosInSeguridad.id],
      name: "fk_compra_usuario",
    }),

    unique("comprascursosinacademia_foliocompra_key").on(
      table.foliocompra,
    ),

    check("chk_cantidad", sql`${table.cantidadcupos} > 0`),

    check(
      "chk_descuento",
      sql`${table.descuento} >= 0 AND ${table.descuento} <= ${table.subtotal}`,
    ),

    check(
      "chk_precio",
      sql`${table.preciounitario} >= 0`,
    ),

    check(
      "chk_subtotal",
      sql`${table.subtotal} >= 0`,
    ),

    check(
      "chk_total",
      sql`${table.total} >= 0`,
    ),

    check(
      "chk_total_calculado",
      sql`${table.total} = ${table.subtotal} - ${table.descuento}`,
    ),
  ],
);

export const estadocomprainacademiaInAcademia = academia.table("estadocomprainacademia", {
	idestadocompra: smallserial().primaryKey().notNull(),
	nombre: varchar({ length: 40 }).notNull(),
	descripcion: varchar({ length: 250 }),
	activo: boolean().default(true).notNull(),
	fecharegistro: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("estadocomprainacademia_nombre_key").on(table.nombre),
]);

export const inscripcionesCursosInAcademia = academia.table("inscripciones_cursos", {
	idInscripcion: serial("id_inscripcion").primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	usuarioId: integer("usuario_id"),
	fechaInscripcion: timestamp("fecha_inscripcion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	estado: varchar({ length: 20 }).default('activo'),
	montoPagado: numeric("monto_pagado", { precision: 10, scale:  2 }),
	metodoPago: varchar("metodo_pago", { length: 50 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participanteId: bigint("participante_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	compraParticipanteId: bigint("compra_participante_id", { mode: "number" }),
	origenInscripcion: varchar("origen_inscripcion", { length: 25 }).default('Sistema anterior').notNull(),
	fechaConfirmacion: timestamp("fecha_confirmacion", { mode: 'string' }),
	observaciones: text(),
}, (table) => [
	index("idx_inscripciones_compra_participante").using("btree", table.compraParticipanteId.asc().nullsLast().op("int8_ops")),
	index("idx_inscripciones_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_inscripciones_curso_estado").using("btree", table.cursoId.asc().nullsLast().op("int4_ops"), table.estado.asc().nullsLast().op("int4_ops")),
	index("idx_inscripciones_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_inscripciones_fecha").using("btree", table.fechaInscripcion.desc().nullsFirst().op("timestamp_ops")),
	index("idx_inscripciones_origen").using("btree", table.origenInscripcion.asc().nullsLast().op("text_ops")),
	index("idx_inscripciones_participante").using("btree", table.participanteId.asc().nullsLast().op("int8_ops")),
	index("idx_inscripciones_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_inscripcion_curso_participante").using("btree", table.cursoId.asc().nullsLast().op("int8_ops"), table.participanteId.asc().nullsLast().op("int4_ops")).where(sql`(participante_id IS NOT NULL)`),
	uniqueIndex("uq_inscripciones_compra_participante").using("btree", table.compraParticipanteId.asc().nullsLast().op("int8_ops")).where(sql`(compra_participante_id IS NOT NULL)`),
	foreignKey({
			columns: [table.compraParticipanteId],
			foreignColumns: [compraParticipantesInAcademia.idCompraParticipante],
			name: "fk_inscripcion_compra_participante"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_inscripcion_curso"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.participanteId],
			foreignColumns: [participantesInAcademia.idParticipante],
			name: "fk_inscripcion_participante"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_inscripcion_usuario"
		}).onDelete("cascade"),
	unique("unique_inscripcion_curso_usuario").on(table.cursoId, table.usuarioId),
	unique("uq_inscripcion_compra_participante").on(table.compraParticipanteId),
	check("chk_inscripcion_origen_compra", sql`((origen_inscripcion)::text <> 'Compra'::text) OR (compra_participante_id IS NOT NULL)`),
	check("chk_origen_inscripcion", sql`(origen_inscripcion)::text = ANY ((ARRAY['Compra'::character varying, 'Administrativa'::character varying, 'Sistema anterior'::character varying])::text[])`),
]);

export const participantesInAcademia = academia.table("participantes", {
	idParticipante: bigserial("id_participante", { mode: "bigint" }).primaryKey().notNull(),
	usuarioId: integer("usuario_id"),
	nombre: varchar({ length: 100 }).notNull(),
	apellidoPaterno: varchar("apellido_paterno", { length: 100 }).notNull(),
	apellidoMaterno: varchar("apellido_materno", { length: 100 }),
	fechaNacimiento: date("fecha_nacimiento"),
	sexo: varchar({ length: 20 }),
	telefono: varchar({ length: 20 }),
	correo: varchar({ length: 150 }),
	activo: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_participante_nombre").using("btree", table.apellidoPaterno.asc().nullsLast().op("text_ops"), table.apellidoMaterno.asc().nullsLast().op("text_ops"), table.nombre.asc().nullsLast().op("text_ops")),
	index("idx_participante_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	index("idx_participantes_activos").using("btree", table.idParticipante.asc().nullsLast().op("int8_ops")).where(sql`(activo = true)`),
	index("idx_participantes_correo").using("btree", table.correo.asc().nullsLast().op("text_ops")),
	index("idx_participantes_nombre").using("btree", table.apellidoPaterno.asc().nullsLast().op("text_ops"), table.apellidoMaterno.asc().nullsLast().op("text_ops"), table.nombre.asc().nullsLast().op("text_ops")),
	index("idx_participantes_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_participante_usuario"
		}).onDelete("set null"),
	check("chk_participante_fecha_nacimiento", sql`(fecha_nacimiento IS NULL) OR (fecha_nacimiento <= CURRENT_DATE)`),
	check("chk_participante_sexo", sql`(sexo IS NULL) OR ((sexo)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying, 'Otro'::character varying, 'Prefiere no indicar'::character varying])::text[]))`),
]);

export const compraParticipantesInAcademia = academia.table("compra_participantes", {
	idCompraParticipante: bigserial("id_compra_participante", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCompra: bigint("id_compra", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idParticipante: bigint("id_participante", { mode: "number" }).notNull(),
	numeroCupo: smallint("numero_cupo").notNull(),
	estado: varchar({ length: 20 }).default('Registrado').notNull(),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_compra_participantes_compra").using("btree", table.idCompra.asc().nullsLast().op("int8_ops")),
	index("idx_compra_participantes_compra_cupo").using("btree", table.idCompra.asc().nullsLast().op("int2_ops"), table.numeroCupo.asc().nullsLast().op("int2_ops")),
	index("idx_compra_participantes_compra_estado").using("btree", table.idCompra.asc().nullsLast().op("int8_ops"), table.estado.asc().nullsLast().op("int8_ops")),
	index("idx_compra_participantes_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_compra_participantes_participante").using("btree", table.idParticipante.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_compra_participantes_numero_cupo").using("btree", table.idCompra.asc().nullsLast().op("int2_ops"), table.numeroCupo.asc().nullsLast().op("int2_ops")),
	uniqueIndex("uq_compra_participantes_participante").using("btree", table.idCompra.asc().nullsLast().op("int8_ops"), table.idParticipante.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.idCompra],
			foreignColumns: [comprascursosinacademiaInAcademia.idcompra],
			name: "fk_compra_participante_compra"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idParticipante],
			foreignColumns: [participantesInAcademia.idParticipante],
			name: "fk_compra_participante_persona"
		}).onDelete("restrict"),
	unique("uq_compra_participante").on(table.idCompra, table.idParticipante),
	unique("uq_compra_numero_cupo").on(table.idCompra, table.numeroCupo),
	check("chk_estado_compra_participante", sql`(estado)::text = ANY ((ARRAY['Registrado'::character varying, 'Confirmado'::character varying, 'Cancelado'::character varying, 'Inscrito'::character varying])::text[])`),
	check("chk_numero_cupo", sql`numero_cupo > 0`),
]);

export const pagosCursosInAcademia = academia.table("pagos_cursos", {
	idPago: bigserial("id_pago", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCompra: bigint("id_compra", { mode: "number" }).notNull(),
	idMetodoPago: smallint("id_metodo_pago").notNull(),
	monto: numeric({ precision: 10, scale:  2 }).notNull(),
	referencia: varchar({ length: 100 }),
	rutaComprobante: text("ruta_comprobante"),
	nombreArchivoOriginal: varchar("nombre_archivo_original", { length: 255 }),
	tipoArchivo: varchar("tipo_archivo", { length: 100 }),
	estado: varchar({ length: 20 }).default('Reportado').notNull(),
	fechaPago: timestamp("fecha_pago", { mode: 'string' }).notNull(),
	fechaReporte: timestamp("fecha_reporte", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	fechaValidacion: timestamp("fecha_validacion", { mode: 'string' }),
	usuarioValida: integer("usuario_valida"),
	motivoRechazo: text("motivo_rechazo"),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_pagos_cursos_compra").using("btree", table.idCompra.asc().nullsLast().op("int8_ops")),
	index("idx_pagos_cursos_compra_estado").using("btree", table.idCompra.asc().nullsLast().op("int8_ops"), table.estado.asc().nullsLast().op("int8_ops")),
	index("idx_pagos_cursos_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_pagos_cursos_fecha_reporte").using("btree", table.fechaReporte.asc().nullsLast().op("timestamp_ops")),
	index("idx_pagos_cursos_metodo").using("btree", table.idMetodoPago.asc().nullsLast().op("int2_ops")),
	index("idx_pagos_cursos_reportados").using("btree", table.fechaReporte.asc().nullsLast().op("timestamp_ops"), table.idPago.asc().nullsLast().op("timestamp_ops")).where(sql`((estado)::text = 'Reportado'::text)`),
	index("idx_pagos_cursos_usuario_valida").using("btree", table.usuarioValida.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.idCompra],
			foreignColumns: [comprascursosinacademiaInAcademia.idcompra],
			name: "fk_pago_compra"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.idMetodoPago],
			foreignColumns: [metodosPagoCursosInAcademia.idMetodoPago],
			name: "fk_pago_metodo"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioValida],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_pago_usuario_valida"
		}).onDelete("set null"),
	check("chk_pago_estado", sql`(estado)::text = ANY ((ARRAY['Reportado'::character varying, 'En revisión'::character varying, 'Aprobado'::character varying, 'Rechazado'::character varying, 'Cancelado'::character varying])::text[])`),
	check("chk_pago_monto", sql`monto > (0)::numeric`),
	check("chk_pago_motivo_rechazo", sql`((estado)::text <> 'Rechazado'::text) OR (motivo_rechazo IS NOT NULL)`),
	check("chk_pago_validacion", sql`(fecha_validacion IS NULL) OR (fecha_validacion >= fecha_reporte)`),
]);

export const metodosPagoCursosInAcademia = academia.table("metodos_pago_cursos", {
	idMetodoPago: smallserial("id_metodo_pago").primaryKey().notNull(),
	nombre: varchar({ length: 60 }).notNull(),
	descripcion: varchar({ length: 250 }),
	requiereComprobante: boolean("requiere_comprobante").default(true).notNull(),
	instrucciones: text(),
	activo: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("metodos_pago_cursos_nombre_key").on(table.nombre),
]);

export const historialEstadosCompraInAcademia = academia.table("historial_estados_compra", {
	idHistorialEstado: bigserial("id_historial_estado", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCompra: bigint("id_compra", { mode: "number" }).notNull(),
	idEstadoAnterior: smallint("id_estado_anterior"),
	idEstadoNuevo: smallint("id_estado_nuevo").notNull(),
	usuarioResponsable: integer("usuario_responsable"),
	origenCambio: varchar("origen_cambio", { length: 20 }).notNull(),
	motivo: varchar({ length: 250 }),
	observaciones: text(),
	fechaCambio: timestamp("fecha_cambio", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_historial_estado_nuevo").using("btree", table.idEstadoNuevo.asc().nullsLast().op("int2_ops")),
	index("idx_historial_estados_compra").using("btree", table.idCompra.asc().nullsLast().op("int8_ops")),
	index("idx_historial_estados_compra_compra").using("btree", table.idCompra.asc().nullsLast().op("int8_ops")),
	index("idx_historial_estados_compra_compra_fecha").using("btree", table.idCompra.asc().nullsLast().op("int8_ops"), table.fechaCambio.desc().nullsFirst().op("timestamp_ops")),
	index("idx_historial_estados_compra_fecha").using("btree", table.fechaCambio.asc().nullsLast().op("timestamp_ops")),
	index("idx_historial_estados_fecha").using("btree", table.fechaCambio.asc().nullsLast().op("timestamp_ops")),
	index("idx_historial_usuario_responsable").using("btree", table.usuarioResponsable.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.idCompra],
			foreignColumns: [comprascursosinacademiaInAcademia.idcompra],
			name: "fk_historial_compra"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.idEstadoAnterior],
			foreignColumns: [estadocomprainacademiaInAcademia.idestadocompra],
			name: "fk_historial_estado_anterior"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.idEstadoNuevo],
			foreignColumns: [estadocomprainacademiaInAcademia.idestadocompra],
			name: "fk_historial_estado_nuevo"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioResponsable],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_historial_usuario_responsable"
		}).onDelete("set null"),
	check("chk_historial_estados_diferentes", sql`(id_estado_anterior IS NULL) OR (id_estado_anterior <> id_estado_nuevo)`),
	check("chk_historial_origen", sql`(origen_cambio)::text = ANY ((ARRAY['Sistema'::character varying, 'Usuario'::character varying, 'Administrador'::character varying])::text[])`),
]);

export const movimientosCuposCursoInAcademia = academia.table("movimientos_cupos_curso", {
	idMovimientoCupo: bigserial("id_movimiento_cupo", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	compraId: bigint("compra_id", { mode: "number" }),
	tipoMovimiento: varchar("tipo_movimiento", { length: 30 }).notNull(),
	cantidad: integer().notNull(),
	cuposAntes: integer("cupos_antes").notNull(),
	cuposDespues: integer("cupos_despues").notNull(),
	usuarioResponsable: integer("usuario_responsable"),
	motivo: varchar({ length: 250 }).notNull(),
	observaciones: text(),
	fechaMovimiento: timestamp("fecha_movimiento", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_movimientos_cupos_compra").using("btree", table.compraId.asc().nullsLast().op("int8_ops")),
	index("idx_movimientos_cupos_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_movimientos_cupos_curso_fecha").using("btree", table.cursoId.asc().nullsLast().op("int4_ops"), table.fechaMovimiento.desc().nullsFirst().op("int4_ops")),
	index("idx_movimientos_cupos_fecha").using("btree", table.fechaMovimiento.asc().nullsLast().op("timestamp_ops")),
	index("idx_movimientos_cupos_tipo").using("btree", table.tipoMovimiento.asc().nullsLast().op("text_ops")),
	index("idx_movimientos_cupos_usuario").using("btree", table.usuarioResponsable.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.compraId],
			foreignColumns: [comprascursosinacademiaInAcademia.idcompra],
			name: "fk_movimiento_cupo_compra"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_movimiento_cupo_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioResponsable],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_movimiento_cupo_usuario"
		}).onDelete("set null"),
	check("chk_movimiento_cupo_calculo", sql`(((tipo_movimiento)::text = ANY ((ARRAY['Reserva'::character varying, 'Inscripción directa'::character varying, 'Ajuste de entrada'::character varying])::text[])) AND (cupos_despues = (cupos_antes + cantidad))) OR (((tipo_movimiento)::text = ANY ((ARRAY['Liberación'::character varying, 'Ajuste de salida'::character varying])::text[])) AND (cupos_despues = (cupos_antes - cantidad)))`),
	check("chk_movimiento_cupo_cantidad", sql`cantidad > 0`),
	check("chk_movimiento_cupo_compra", sql`((tipo_movimiento)::text <> ALL ((ARRAY['Reserva'::character varying, 'Liberación'::character varying])::text[])) OR (compra_id IS NOT NULL)`),
	check("chk_movimiento_cupo_tipo", sql`(tipo_movimiento)::text = ANY ((ARRAY['Reserva'::character varying, 'Liberación'::character varying, 'Inscripción directa'::character varying, 'Ajuste de entrada'::character varying, 'Ajuste de salida'::character varying])::text[])`),
	check("chk_movimiento_cupo_valores", sql`(cupos_antes >= 0) AND (cupos_despues >= 0)`),
]);

export const historialEstadosCursoInAcademia = academia.table("historial_estados_curso", {
	idHistorialEstadoCurso: bigserial("id_historial_estado_curso", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	estadoAnterior: varchar("estado_anterior", { length: 40 }),
	estadoNuevo: varchar("estado_nuevo", { length: 40 }).notNull(),
	usuarioResponsable: integer("usuario_responsable"),
	origenCambio: varchar("origen_cambio", { length: 20 }).notNull(),
	motivo: varchar({ length: 250 }),
	observaciones: text(),
	fechaCambio: timestamp("fecha_cambio", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_historial_estados_curso_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_historial_estados_curso_estado_nuevo").using("btree", table.estadoNuevo.asc().nullsLast().op("text_ops")),
	index("idx_historial_estados_curso_fecha").using("btree", table.fechaCambio.asc().nullsLast().op("timestamp_ops")),
	index("idx_historial_estados_curso_usuario").using("btree", table.usuarioResponsable.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_historial_estado_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioResponsable],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_historial_estado_curso_usuario"
		}).onDelete("set null"),
	check("chk_historial_estado_curso_anterior", sql`(estado_anterior IS NULL) OR ((estado_anterior)::text = ANY ((ARRAY['Borrador'::character varying, 'Publicado'::character varying, 'Inscripciones abiertas'::character varying, 'Cupo completo'::character varying, 'Inscripciones cerradas'::character varying, 'En curso'::character varying, 'Finalizado'::character varying, 'Cancelado'::character varying])::text[]))`),
	check("chk_historial_estado_curso_diferente", sql`(estado_anterior IS NULL) OR ((estado_anterior)::text <> (estado_nuevo)::text)`),
	check("chk_historial_estado_curso_nuevo", sql`(estado_nuevo)::text = ANY ((ARRAY['Borrador'::character varying, 'Publicado'::character varying, 'Inscripciones abiertas'::character varying, 'Cupo completo'::character varying, 'Inscripciones cerradas'::character varying, 'En curso'::character varying, 'Finalizado'::character varying, 'Cancelado'::character varying])::text[])`),
	check("chk_historial_estado_curso_origen", sql`(origen_cambio)::text = ANY ((ARRAY['Sistema'::character varying, 'Administrador'::character varying])::text[])`),
]);

export const sesionesCursoInAcademia = academia.table("sesiones_curso", {
	idSesion: bigserial("id_sesion", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	numeroSesion: smallint("numero_sesion").notNull(),
	titulo: varchar({ length: 150 }).notNull(),
	descripcion: text(),
	fecha: date().notNull(),
	horaInicio: time("hora_inicio").notNull(),
	horaFin: time("hora_fin").notNull(),
	modalidadId: integer("modalidad_id"),
	ubicacionId: integer("ubicacion_id"),
	enlaceVirtual: text("enlace_virtual"),
	estado: varchar({ length: 20 }).default('Programada').notNull(),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_sesiones_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_sesiones_curso_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_sesiones_curso_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_sesiones_curso_fecha").using("btree", table.fecha.asc().nullsLast().op("date_ops")),
	index("idx_sesiones_curso_modalidad").using("btree", table.modalidadId.asc().nullsLast().op("int4_ops")),
	index("idx_sesiones_curso_ubicacion").using("btree", table.ubicacionId.asc().nullsLast().op("int4_ops")),
	index("idx_sesiones_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_sesiones_fecha").using("btree", table.fecha.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_sesion_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.modalidadId],
			foreignColumns: [modalidadesInAcademia.idModalidad],
			name: "fk_sesion_modalidad"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.ubicacionId],
			foreignColumns: [ubicacionesCursosInAcademia.idUbicacion],
			name: "fk_sesion_ubicacion"
		}).onDelete("restrict"),
	unique("uq_sesion_numero").on(table.cursoId, table.numeroSesion),
	check("chk_sesion_enlace_virtual", sql`(enlace_virtual IS NULL) OR (length(TRIM(BOTH FROM enlace_virtual)) > 0)`),
	check("chk_sesion_estado", sql`(estado)::text = ANY ((ARRAY['Programada'::character varying, 'En curso'::character varying, 'Finalizada'::character varying, 'Cancelada'::character varying, 'Reprogramada'::character varying])::text[])`),
	check("chk_sesion_horario", sql`hora_fin > hora_inicio`),
	check("chk_sesion_numero", sql`numero_sesion > 0`),
]);

export const asistenciasCursoInAcademia = academia.table("asistencias_curso", {
	idAsistencia: bigserial("id_asistencia", { mode: "bigint" }).primaryKey().notNull(),
	inscripcionId: integer("inscripcion_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionId: bigint("sesion_id", { mode: "number" }).notNull(),
	estadoAsistencia: varchar("estado_asistencia", { length: 25 }).default('Pendiente').notNull(),
	horaEntrada: time("hora_entrada"),
	horaSalida: time("hora_salida"),
	minutosRetardo: smallint("minutos_retardo"),
	justificada: boolean().default(false).notNull(),
	motivoJustificacion: text("motivo_justificacion"),
	comprobanteJustificacion: text("comprobante_justificacion"),
	usuarioRegistra: integer("usuario_registra"),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	observaciones: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_asistencias_estado").using("btree", table.estadoAsistencia.asc().nullsLast().op("text_ops")),
	index("idx_asistencias_fecha_registro").using("btree", table.fechaRegistro.asc().nullsLast().op("timestamp_ops")),
	index("idx_asistencias_inscripcion").using("btree", table.inscripcionId.asc().nullsLast().op("int4_ops")),
	index("idx_asistencias_sesion").using("btree", table.sesionId.asc().nullsLast().op("int8_ops")),
	index("idx_asistencias_sesion_estado").using("btree", table.sesionId.asc().nullsLast().op("text_ops"), table.estadoAsistencia.asc().nullsLast().op("int8_ops")),
	index("idx_asistencias_usuario_registra").using("btree", table.usuarioRegistra.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_asistencias_sesion_inscripcion").using("btree", table.sesionId.asc().nullsLast().op("int4_ops"), table.inscripcionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.inscripcionId],
			foreignColumns: [inscripcionesCursosInAcademia.idInscripcion],
			name: "fk_asistencia_inscripcion"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.sesionId],
			foreignColumns: [sesionesCursoInAcademia.idSesion],
			name: "fk_asistencia_sesion"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioRegistra],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_asistencia_usuario"
		}).onDelete("set null"),
	unique("uq_asistencia_inscripcion_sesion").on(table.inscripcionId, table.sesionId),
	check("chk_asistencia_estado", sql`(estado_asistencia)::text = ANY ((ARRAY['Pendiente'::character varying, 'Presente'::character varying, 'Ausente'::character varying, 'Retardo'::character varying, 'Falta justificada'::character varying, 'Salida anticipada'::character varying])::text[])`),
	check("chk_asistencia_horario", sql`(hora_entrada IS NULL) OR (hora_salida IS NULL) OR (hora_salida >= hora_entrada)`),
	check("chk_asistencia_justificacion", sql`((estado_asistencia)::text <> 'Falta justificada'::text) OR ((justificada = true) AND (motivo_justificacion IS NOT NULL) AND (length(TRIM(BOTH FROM motivo_justificacion)) > 0))`),
	check("chk_asistencia_retardo", sql`(minutos_retardo IS NULL) OR (minutos_retardo >= 0)`),
	check("chk_asistencia_retardo_minutos", sql`((estado_asistencia)::text <> 'Retardo'::text) OR (minutos_retardo IS NOT NULL)`),
]);

export const progresoCursoInAcademia = academia.table("progreso_curso", {
	idProgreso: bigserial("id_progreso", { mode: "bigint" }).primaryKey().notNull(),
	inscripcionId: integer("inscripcion_id").notNull(),
	sesionesTotales: smallint("sesiones_totales").default(0).notNull(),
	sesionesCompletadas: smallint("sesiones_completadas").default(0).notNull(),
	porcentajeAvance: numeric("porcentaje_avance", { precision: 5, scale:  2 }).default('0').notNull(),
	porcentajeAsistencia: numeric("porcentaje_asistencia", { precision: 5, scale:  2 }).default('0').notNull(),
	estadoAcademico: varchar("estado_academico", { length: 20 }).default('No iniciado').notNull(),
	fechaInicio: timestamp("fecha_inicio", { mode: 'string' }),
	fechaUltimaActividad: timestamp("fecha_ultima_actividad", { mode: 'string' }),
	fechaFinalizacion: timestamp("fecha_finalizacion", { mode: 'string' }),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_progreso_actualizacion").using("btree", table.fechaUltimaActividad.asc().nullsLast().op("timestamp_ops")),
	index("idx_progreso_asistencia").using("btree", table.porcentajeAsistencia.asc().nullsLast().op("numeric_ops")),
	index("idx_progreso_avance").using("btree", table.porcentajeAvance.asc().nullsLast().op("numeric_ops")),
	index("idx_progreso_estado").using("btree", table.estadoAcademico.asc().nullsLast().op("text_ops")),
	index("idx_progreso_finalizacion").using("btree", table.fechaFinalizacion.asc().nullsLast().op("timestamp_ops")).where(sql`(fecha_finalizacion IS NOT NULL)`),
	index("idx_progreso_inscripcion").using("btree", table.inscripcionId.asc().nullsLast().op("int4_ops")),
	index("idx_progreso_ultima_actividad").using("btree", table.fechaUltimaActividad.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.inscripcionId],
			foreignColumns: [inscripcionesCursosInAcademia.idInscripcion],
			name: "fk_progreso_inscripcion"
		}).onDelete("restrict"),
	unique("uq_progreso_inscripcion").on(table.inscripcionId),
	check("chk_progreso_completado", sql`((estado_academico)::text <> 'Completado'::text) OR (fecha_finalizacion IS NOT NULL)`),
	check("chk_progreso_estado", sql`(estado_academico)::text = ANY ((ARRAY['No iniciado'::character varying, 'En progreso'::character varying, 'Completado'::character varying, 'No aprobado'::character varying, 'Abandonado'::character varying, 'Suspendido'::character varying])::text[])`),
	check("chk_progreso_fecha_actividad", sql`(fecha_inicio IS NULL) OR (fecha_ultima_actividad IS NULL) OR (fecha_ultima_actividad >= fecha_inicio)`),
	check("chk_progreso_fechas", sql`(fecha_inicio IS NULL) OR (fecha_finalizacion IS NULL) OR (fecha_finalizacion >= fecha_inicio)`),
	check("chk_progreso_porcentaje_asistencia", sql`(porcentaje_asistencia >= (0)::numeric) AND (porcentaje_asistencia <= (100)::numeric)`),
	check("chk_progreso_porcentaje_avance", sql`(porcentaje_avance >= (0)::numeric) AND (porcentaje_avance <= (100)::numeric)`),
	check("chk_progreso_sesiones_completadas", sql`(sesiones_completadas >= 0) AND (sesiones_completadas <= sesiones_totales)`),
	check("chk_progreso_sesiones_totales", sql`sesiones_totales >= 0`),
]);

export const evaluacionesCursoInAcademia = academia.table("evaluaciones_curso", {
	idEvaluacion: bigserial("id_evaluacion", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionId: bigint("sesion_id", { mode: "number" }),
	titulo: varchar({ length: 150 }).notNull(),
	descripcion: text(),
	tipoEvaluacion: varchar("tipo_evaluacion", { length: 30 }).notNull(),
	puntajeMaximo: numeric("puntaje_maximo", { precision: 8, scale:  2 }).default('100').notNull(),
	puntajeMinimoAprobatorio: numeric("puntaje_minimo_aprobatorio", { precision: 8, scale:  2 }).default('70').notNull(),
	ponderacion: numeric({ precision: 5, scale:  2 }).default('0').notNull(),
	obligatoria: boolean().default(true).notNull(),
	fechaApertura: timestamp("fecha_apertura", { mode: 'string' }),
	fechaLimite: timestamp("fecha_limite", { mode: 'string' }),
	intentosPermitidos: smallint("intentos_permitidos").default(1).notNull(),
	estado: varchar({ length: 20 }).default('Borrador').notNull(),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_evaluaciones_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_evaluaciones_curso_estado").using("btree", table.cursoId.asc().nullsLast().op("int4_ops"), table.estado.asc().nullsLast().op("text_ops")),
	index("idx_evaluaciones_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_evaluaciones_fecha_limite").using("btree", table.fechaLimite.asc().nullsLast().op("timestamp_ops")),
	index("idx_evaluaciones_sesion").using("btree", table.sesionId.asc().nullsLast().op("int8_ops")),
	index("idx_evaluaciones_tipo").using("btree", table.tipoEvaluacion.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_evaluacion_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.sesionId],
			foreignColumns: [sesionesCursoInAcademia.idSesion],
			name: "fk_evaluacion_sesion"
		}).onDelete("set null"),
	check("chk_evaluacion_estado", sql`(estado)::text = ANY ((ARRAY['Borrador'::character varying, 'Publicada'::character varying, 'En aplicación'::character varying, 'Cerrada'::character varying, 'Cancelada'::character varying])::text[])`),
	check("chk_evaluacion_fechas", sql`(fecha_apertura IS NULL) OR (fecha_limite IS NULL) OR (fecha_limite >= fecha_apertura)`),
	check("chk_evaluacion_intentos", sql`intentos_permitidos > 0`),
	check("chk_evaluacion_ponderacion", sql`(ponderacion >= (0)::numeric) AND (ponderacion <= (100)::numeric)`),
	check("chk_evaluacion_puntaje_aprobatorio", sql`(puntaje_minimo_aprobatorio >= (0)::numeric) AND (puntaje_minimo_aprobatorio <= puntaje_maximo)`),
	check("chk_evaluacion_puntaje_maximo", sql`puntaje_maximo > (0)::numeric`),
	check("chk_evaluacion_tipo", sql`(tipo_evaluacion)::text = ANY ((ARRAY['Diagnóstica'::character varying, 'Cuestionario'::character varying, 'Examen'::character varying, 'Práctica'::character varying, 'Actividad'::character varying, 'Proyecto'::character varying, 'Evaluación final'::character varying])::text[])`),
]);

export const resultadosEvaluacionesInAcademia = academia.table("resultados_evaluaciones", {
	idResultado: bigserial("id_resultado", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionId: bigint("evaluacion_id", { mode: "number" }).notNull(),
	inscripcionId: integer("inscripcion_id").notNull(),
	numeroIntento: smallint("numero_intento").notNull(),
	puntajeObtenido: numeric("puntaje_obtenido", { precision: 8, scale:  2 }),
	porcentajeObtenido: numeric("porcentaje_obtenido", { precision: 5, scale:  2 }),
	aprobado: boolean(),
	estadoResultado: varchar("estado_resultado", { length: 20 }).default('Pendiente').notNull(),
	fechaInicio: timestamp("fecha_inicio", { mode: 'string' }),
	fechaEntrega: timestamp("fecha_entrega", { mode: 'string' }),
	fechaCalificacion: timestamp("fecha_calificacion", { mode: 'string' }),
	usuarioCalifica: integer("usuario_califica"),
	retroalimentacion: text(),
	evidenciaUrl: text("evidencia_url"),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_resultados_aprobado").using("btree", table.aprobado.asc().nullsLast().op("bool_ops")),
	index("idx_resultados_estado").using("btree", table.estadoResultado.asc().nullsLast().op("text_ops")),
	index("idx_resultados_evaluacion").using("btree", table.evaluacionId.asc().nullsLast().op("int8_ops")),
	index("idx_resultados_evaluacion_inscripcion").using("btree", table.evaluacionId.asc().nullsLast().op("int8_ops"), table.inscripcionId.asc().nullsLast().op("int4_ops")),
	index("idx_resultados_fecha_entrega").using("btree", table.fechaEntrega.asc().nullsLast().op("timestamp_ops")),
	index("idx_resultados_inscripcion").using("btree", table.inscripcionId.asc().nullsLast().op("int4_ops")),
	index("idx_resultados_usuario_califica").using("btree", table.usuarioCalifica.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_resultados_evaluacion_inscripcion").using("btree", table.evaluacionId.asc().nullsLast().op("int4_ops"), table.inscripcionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.evaluacionId],
			foreignColumns: [evaluacionesCursoInAcademia.idEvaluacion],
			name: "fk_resultado_evaluacion"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.inscripcionId],
			foreignColumns: [inscripcionesCursosInAcademia.idInscripcion],
			name: "fk_resultado_inscripcion"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioCalifica],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_resultado_usuario_califica"
		}).onDelete("set null"),
	unique("uq_resultado_intento").on(table.evaluacionId, table.inscripcionId, table.numeroIntento),
	check("chk_resultado_calificado", sql`((estado_resultado)::text <> 'Calificado'::text) OR ((puntaje_obtenido IS NOT NULL) AND (porcentaje_obtenido IS NOT NULL) AND (aprobado IS NOT NULL) AND (fecha_calificacion IS NOT NULL))`),
	check("chk_resultado_estado", sql`(estado_resultado)::text = ANY ((ARRAY['Pendiente'::character varying, 'En progreso'::character varying, 'Entregado'::character varying, 'Calificado'::character varying, 'Anulado'::character varying])::text[])`),
	check("chk_resultado_fechas_calificacion", sql`(fecha_entrega IS NULL) OR (fecha_calificacion IS NULL) OR (fecha_calificacion >= fecha_entrega)`),
	check("chk_resultado_fechas_entrega", sql`(fecha_inicio IS NULL) OR (fecha_entrega IS NULL) OR (fecha_entrega >= fecha_inicio)`),
	check("chk_resultado_numero_intento", sql`numero_intento > 0`),
	check("chk_resultado_porcentaje", sql`(porcentaje_obtenido IS NULL) OR ((porcentaje_obtenido >= (0)::numeric) AND (porcentaje_obtenido <= (100)::numeric))`),
	check("chk_resultado_puntaje", sql`(puntaje_obtenido IS NULL) OR (puntaje_obtenido >= (0)::numeric)`),
]);

export const notificacionesAcademicasInAcademia = academia.table("notificaciones_academicas", {
	idNotificacion: bigserial("id_notificacion", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id"),
	inscripcionId: integer("inscripcion_id"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionId: bigint("sesion_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionId: bigint("evaluacion_id", { mode: "number" }),
	tipoNotificacion: varchar("tipo_notificacion", { length: 40 }).notNull(),
	titulo: varchar({ length: 150 }).notNull(),
	mensaje: text().notNull(),
	canal: varchar({ length: 20 }).default('Sistema').notNull(),
	estadoEnvio: varchar("estado_envio", { length: 20 }).default('Pendiente').notNull(),
	fechaProgramada: timestamp("fecha_programada", { mode: 'string' }),
	fechaEnvio: timestamp("fecha_envio", { mode: 'string' }),
	fechaLectura: timestamp("fecha_lectura", { mode: 'string' }),
	intentosEnvio: smallint("intentos_envio").default(0).notNull(),
	ultimoError: text("ultimo_error"),
	usuarioCrea: integer("usuario_crea"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_notificaciones_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_notificaciones_estado").using("btree", table.estadoEnvio.asc().nullsLast().op("text_ops")),
	index("idx_notificaciones_evaluacion").using("btree", table.evaluacionId.asc().nullsLast().op("int8_ops")),
	index("idx_notificaciones_fecha_programada").using("btree", table.fechaProgramada.asc().nullsLast().op("timestamp_ops")),
	index("idx_notificaciones_inscripcion").using("btree", table.inscripcionId.asc().nullsLast().op("int4_ops")),
	index("idx_notificaciones_pendientes").using("btree", table.fechaProgramada.asc().nullsLast().op("timestamp_ops")).where(sql`((estado_envio)::text = 'Pendiente'::text)`),
	index("idx_notificaciones_sesion").using("btree", table.sesionId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_notificacion_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.evaluacionId],
			foreignColumns: [evaluacionesCursoInAcademia.idEvaluacion],
			name: "fk_notificacion_evaluacion"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.inscripcionId],
			foreignColumns: [inscripcionesCursosInAcademia.idInscripcion],
			name: "fk_notificacion_inscripcion"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.sesionId],
			foreignColumns: [sesionesCursoInAcademia.idSesion],
			name: "fk_notificacion_sesion"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.usuarioCrea],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_notificacion_usuario_crea"
		}).onDelete("set null"),
	check("chk_notificacion_canal", sql`(canal)::text = ANY ((ARRAY['Sistema'::character varying, 'Correo'::character varying, 'WhatsApp'::character varying])::text[])`),
	check("chk_notificacion_destino", sql`(curso_id IS NOT NULL) OR (inscripcion_id IS NOT NULL)`),
	check("chk_notificacion_enviada", sql`((estado_envio)::text <> ALL ((ARRAY['Enviada'::character varying, 'Leída'::character varying])::text[])) OR (fecha_envio IS NOT NULL)`),
	check("chk_notificacion_estado", sql`(estado_envio)::text = ANY ((ARRAY['Pendiente'::character varying, 'Procesando'::character varying, 'Enviada'::character varying, 'Fallida'::character varying, 'Cancelada'::character varying, 'Leída'::character varying])::text[])`),
	check("chk_notificacion_fecha_envio", sql`(fecha_programada IS NULL) OR (fecha_envio IS NULL) OR (fecha_envio >= fecha_programada)`),
	check("chk_notificacion_fecha_lectura", sql`(fecha_envio IS NULL) OR (fecha_lectura IS NULL) OR (fecha_lectura >= fecha_envio)`),
	check("chk_notificacion_intentos", sql`intentos_envio >= 0`),
	check("chk_notificacion_leida", sql`((estado_envio)::text <> 'Leída'::text) OR (fecha_lectura IS NOT NULL)`),
	check("chk_notificacion_tipo", sql`(tipo_notificacion)::text = ANY ((ARRAY['Recordatorio de sesión'::character varying, 'Cambio de sesión'::character varying, 'Evaluación disponible'::character varying, 'Evaluación por vencer'::character varying, 'Resultado publicado'::character varying, 'Curso completado'::character varying, 'Certificado disponible'::character varying, 'Aviso general'::character varying])::text[])`),
]);

export const certificadosCursoInAcademia = academia.table("certificados_curso", {
	idCertificado: bigserial("id_certificado", { mode: "bigint" }).primaryKey().notNull(),
	inscripcionId: integer("inscripcion_id").notNull(),
	folioCertificado: varchar("folio_certificado", { length: 40 }).notNull(),
	codigoVerificacion: varchar("codigo_verificacion", { length: 100 }).notNull(),
	fechaEmision: timestamp("fecha_emision", { mode: 'string' }),
	rutaArchivo: text("ruta_archivo"),
	nombreArchivo: varchar("nombre_archivo", { length: 255 }),
	estado: varchar({ length: 20 }).default('Generado').notNull(),
	fechaRevocacion: timestamp("fecha_revocacion", { mode: 'string' }),
	motivoRevocacion: text("motivo_revocacion"),
	usuarioEmite: integer("usuario_emite"),
	usuarioRevoca: integer("usuario_revoca"),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_certificados_codigo").using("btree", table.codigoVerificacion.asc().nullsLast().op("text_ops")),
	index("idx_certificados_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_certificados_fecha_emision").using("btree", table.fechaEmision.asc().nullsLast().op("timestamp_ops")),
	index("idx_certificados_inscripcion").using("btree", table.inscripcionId.asc().nullsLast().op("int4_ops")),
	index("idx_certificados_usuario_emite").using("btree", table.usuarioEmite.asc().nullsLast().op("int4_ops")),
	index("idx_certificados_usuario_revoca").using("btree", table.usuarioRevoca.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_certificados_codigo_verificacion").using("btree", table.codigoVerificacion.asc().nullsLast().op("text_ops")).where(sql`(codigo_verificacion IS NOT NULL)`),
	uniqueIndex("uq_certificados_folio").using("btree", table.folioCertificado.asc().nullsLast().op("text_ops")),
	uniqueIndex("uq_certificados_inscripcion").using("btree", table.inscripcionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.inscripcionId],
			foreignColumns: [inscripcionesCursosInAcademia.idInscripcion],
			name: "fk_certificado_inscripcion"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioEmite],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_certificado_usuario_emite"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.usuarioRevoca],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_certificado_usuario_revoca"
		}).onDelete("set null"),
	unique("uq_certificado_inscripcion").on(table.inscripcionId),
	unique("certificados_curso_folio_certificado_key").on(table.folioCertificado),
	unique("certificados_curso_codigo_verificacion_key").on(table.codigoVerificacion),
	check("chk_certificado_emitido", sql`((estado)::text <> 'Emitido'::text) OR ((fecha_emision IS NOT NULL) AND (ruta_archivo IS NOT NULL) AND (length(TRIM(BOTH FROM ruta_archivo)) > 0))`),
	check("chk_certificado_estado", sql`(estado)::text = ANY ((ARRAY['Generado'::character varying, 'Emitido'::character varying, 'Revocado'::character varying, 'Anulado'::character varying])::text[])`),
	check("chk_certificado_fecha_revocacion", sql`(fecha_emision IS NULL) OR (fecha_revocacion IS NULL) OR (fecha_revocacion >= fecha_emision)`),
	check("chk_certificado_revocado", sql`((estado)::text <> 'Revocado'::text) OR ((fecha_revocacion IS NOT NULL) AND (motivo_revocacion IS NOT NULL) AND (length(TRIM(BOTH FROM motivo_revocacion)) > 0))`),
]);

export const requisitosAprobacionCursoInAcademia = academia.table("requisitos_aprobacion_curso", {
	idRequisitoAprobacion: bigserial("id_requisito_aprobacion", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	porcentajeAsistenciaMinima: numeric("porcentaje_asistencia_minima", { precision: 5, scale:  2 }).default('80').notNull(),
	calificacionMinima: numeric("calificacion_minima", { precision: 5, scale:  2 }).default('70').notNull(),
	porcentajeAvanceMinimo: numeric("porcentaje_avance_minimo", { precision: 5, scale:  2 }).default('100').notNull(),
	requiereEvaluacionesObligatorias: boolean("requiere_evaluaciones_obligatorias").default(true).notNull(),
	requiereEvaluacionFinal: boolean("requiere_evaluacion_final").default(false).notNull(),
	permiteFaltasJustificadas: boolean("permite_faltas_justificadas").default(true).notNull(),
	maximoFaltasInjustificadas: smallint("maximo_faltas_injustificadas"),
	requierePagoValidado: boolean("requiere_pago_validado").default(true).notNull(),
	emiteCertificado: boolean("emite_certificado").default(true).notNull(),
	vigente: boolean().default(true).notNull(),
	observaciones: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_requisitos_aprobacion_vigentes").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")).where(sql`(vigente = true)`),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_requisito_aprobacion_curso"
		}).onDelete("restrict"),
	unique("uq_requisito_aprobacion_curso").on(table.cursoId),
	check("chk_requisito_asistencia", sql`(porcentaje_asistencia_minima >= (0)::numeric) AND (porcentaje_asistencia_minima <= (100)::numeric)`),
	check("chk_requisito_avance", sql`(porcentaje_avance_minimo >= (0)::numeric) AND (porcentaje_avance_minimo <= (100)::numeric)`),
	check("chk_requisito_calificacion", sql`(calificacion_minima >= (0)::numeric) AND (calificacion_minima <= (100)::numeric)`),
	check("chk_requisito_faltas", sql`(maximo_faltas_injustificadas IS NULL) OR (maximo_faltas_injustificadas >= 0)`),
]);

export const datasetReglasAsociacionInAnalitica = analitica.table("dataset_reglas_asociacion", {
	idRegistro: bigserial("id_registro", { mode: "bigint" }).primaryKey().notNull(),
	idTransaccionAnalitica: varchar("id_transaccion_analitica", { length: 100 }).notNull(),
	usuarioId: integer("usuario_id").notNull(),
	cursoId: integer("curso_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	compraId: bigint("compra_id", { mode: "number" }).notNull(),
	folioCompra: varchar("folio_compra", { length: 20 }).notNull(),
	fechaCompra: timestamp("fecha_compra", { mode: 'string' }).notNull(),
	anioCompra: smallint("anio_compra").notNull(),
	mesCompra: smallint("mes_compra").notNull(),
	categoriaId: integer("categoria_id"),
	modalidadId: integer("modalidad_id"),
	precioPagado: numeric("precio_pagado", { precision: 10, scale:  2 }).notNull(),
	cantidadCupos: smallint("cantidad_cupos").notNull(),
	estadoCompra: varchar("estado_compra", { length: 60 }).notNull(),
	fechaCarga: timestamp("fecha_carga", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	activoDataset: boolean("activo_dataset").default(true).notNull(),
}, (table) => [
	index("idx_dataset_asociacion_activos").using("btree", table.idTransaccionAnalitica.asc().nullsLast().op("int4_ops"), table.cursoId.asc().nullsLast().op("int4_ops")).where(sql`(activo_dataset = true)`),
	index("idx_dataset_asociacion_categoria").using("btree", table.categoriaId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_asociacion_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_asociacion_estado").using("btree", table.estadoCompra.asc().nullsLast().op("text_ops")),
	index("idx_dataset_asociacion_fecha").using("btree", table.fechaCompra.asc().nullsLast().op("timestamp_ops")),
	index("idx_dataset_asociacion_modalidad").using("btree", table.modalidadId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_asociacion_periodo").using("btree", table.anioCompra.asc().nullsLast().op("int2_ops"), table.mesCompra.asc().nullsLast().op("int2_ops")),
	index("idx_dataset_asociacion_transaccion").using("btree", table.idTransaccionAnalitica.asc().nullsLast().op("text_ops")),
	index("idx_dataset_asociacion_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_asociacion_usuario_curso").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops"), table.cursoId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.compraId],
			foreignColumns: [comprascursosinacademiaInAcademia.idcompra],
			name: "fk_dataset_asociacion_compra"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_dataset_asociacion_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_dataset_asociacion_usuario"
		}).onDelete("restrict"),
	unique("uq_dataset_asociacion_compra").on(table.compraId),
	check("chk_dataset_asociacion_anio", sql`anio_compra >= 2000`),
	check("chk_dataset_asociacion_cupos", sql`cantidad_cupos > 0`),
	check("chk_dataset_asociacion_mes", sql`(mes_compra >= 1) AND (mes_compra <= 12)`),
	check("chk_dataset_asociacion_precio", sql`precio_pagado >= (0)::numeric`),
]);

export const datasetSegmentacionClientesInAnalitica = analitica.table("dataset_segmentacion_clientes", {
	idRegistro: bigserial("id_registro", { mode: "bigint" }).primaryKey().notNull(),
	usuarioId: integer("usuario_id").notNull(),
	fechaPrimeraCompra: timestamp("fecha_primera_compra", { mode: 'string' }),
	fechaUltimaCompra: timestamp("fecha_ultima_compra", { mode: 'string' }),
	diasDesdeUltimaCompra: integer("dias_desde_ultima_compra"),
	antiguedadClienteDias: integer("antiguedad_cliente_dias"),
	totalCompras: integer("total_compras").default(0).notNull(),
	totalComprasValidas: integer("total_compras_validas").default(0).notNull(),
	comprasPendientes: integer("compras_pendientes").default(0).notNull(),
	comprasCanceladas: integer("compras_canceladas").default(0).notNull(),
	comprasRechazadas: integer("compras_rechazadas").default(0).notNull(),
	comprasExpiradas: integer("compras_expiradas").default(0).notNull(),
	cursosDistintos: integer("cursos_distintos").default(0).notNull(),
	categoriasDistintas: integer("categorias_distintas").default(0).notNull(),
	modalidadesDistintas: integer("modalidades_distintas").default(0).notNull(),
	totalCuposAdquiridos: integer("total_cupos_adquiridos").default(0).notNull(),
	totalGastado: numeric("total_gastado", { precision: 12, scale:  2 }).default('0').notNull(),
	ticketPromedio: numeric("ticket_promedio", { precision: 12, scale:  2 }).default('0').notNull(),
	cuposPromedioCompra: numeric("cupos_promedio_compra", { precision: 8, scale:  2 }).default('0').notNull(),
	tasaConversion: numeric("tasa_conversion", { precision: 5, scale:  2 }).default('0').notNull(),
	fechaCarga: timestamp("fecha_carga", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	activoDataset: boolean("activo_dataset").default(true).notNull(),
}, (table) => [
	index("idx_dataset_segmentacion_activos").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")).where(sql`(activo_dataset = true)`),
	index("idx_dataset_segmentacion_compras_validas").using("btree", table.totalComprasValidas.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_segmentacion_conversion").using("btree", table.tasaConversion.asc().nullsLast().op("numeric_ops")),
	index("idx_dataset_segmentacion_recencia").using("btree", table.diasDesdeUltimaCompra.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_segmentacion_total_gastado").using("btree", table.totalGastado.asc().nullsLast().op("numeric_ops")),
	index("idx_dataset_segmentacion_ultima_compra").using("btree", table.fechaUltimaCompra.asc().nullsLast().op("timestamp_ops")),
	index("idx_dataset_segmentacion_valor_frecuencia").using("btree", table.totalGastado.desc().nullsFirst().op("int4_ops"), table.totalComprasValidas.desc().nullsFirst().op("int4_ops")).where(sql`(activo_dataset = true)`),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_dataset_segmentacion_usuario"
		}).onDelete("restrict"),
	unique("dataset_segmentacion_clientes_usuario_id_key").on(table.usuarioId),
	check("chk_segmentacion_antiguedad", sql`(antiguedad_cliente_dias IS NULL) OR (antiguedad_cliente_dias >= 0)`),
	check("chk_segmentacion_compras", sql`(total_compras >= 0) AND (total_compras_validas >= 0) AND (compras_pendientes >= 0) AND (compras_canceladas >= 0) AND (compras_rechazadas >= 0) AND (compras_expiradas >= 0)`),
	check("chk_segmentacion_conversion", sql`(tasa_conversion >= (0)::numeric) AND (tasa_conversion <= (100)::numeric)`),
	check("chk_segmentacion_cupos", sql`(total_cupos_adquiridos >= 0) AND (cupos_promedio_compra >= (0)::numeric)`),
	check("chk_segmentacion_dias_ultima_compra", sql`(dias_desde_ultima_compra IS NULL) OR (dias_desde_ultima_compra >= 0)`),
	check("chk_segmentacion_montos", sql`(total_gastado >= (0)::numeric) AND (ticket_promedio >= (0)::numeric)`),
	check("chk_segmentacion_variedad", sql`(cursos_distintos >= 0) AND (categorias_distintas >= 0) AND (modalidades_distintas >= 0)`),
]);

export const datasetRegresionPrecioCursosInAnalitica = analitica.table("dataset_regresion_precio_cursos", {
	idRegistro: bigserial("id_registro", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	tituloCurso: varchar("titulo_curso", { length: 200 }).notNull(),
	categoriaId: integer("categoria_id"),
	modalidadId: integer("modalidad_id"),
	ubicacionId: integer("ubicacion_id"),
	fechaInicio: date("fecha_inicio"),
	fechaFin: date("fecha_fin"),
	anioInicio: smallint("anio_inicio"),
	mesInicio: smallint("mes_inicio"),
	duracionDias: integer("duracion_dias"),
	cupoMaximo: integer("cupo_maximo").default(0).notNull(),
	cuposOcupados: integer("cupos_ocupados").default(0).notNull(),
	porcentajeOcupacion: numeric("porcentaje_ocupacion", { precision: 5, scale:  2 }).default('0').notNull(),
	totalCompras: integer("total_compras").default(0).notNull(),
	comprasValidas: integer("compras_validas").default(0).notNull(),
	cuposVendidos: integer("cupos_vendidos").default(0).notNull(),
	compradoresUnicos: integer("compradores_unicos").default(0).notNull(),
	ingresosAprobados: numeric("ingresos_aprobados", { precision: 12, scale:  2 }).default('0').notNull(),
	precioHistorico: numeric("precio_historico", { precision: 10, scale:  2 }).notNull(),
	ingresoPromedioPorCupo: numeric("ingreso_promedio_por_cupo", { precision: 12, scale:  2 }).default('0').notNull(),
	diasAnticipacionPrimeraCompra: integer("dias_anticipacion_primera_compra"),
	diasAnticipacionUltimaCompra: integer("dias_anticipacion_ultima_compra"),
	precioSugeridoModelo: numeric("precio_sugerido_modelo", { precision: 10, scale:  2 }),
	versionModelo: varchar("version_modelo", { length: 50 }),
	fechaPrediccion: timestamp("fecha_prediccion", { mode: 'string' }),
	fechaCarga: timestamp("fecha_carga", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	activoDataset: boolean("activo_dataset").default(true).notNull(),
}, (table) => [
	index("idx_dataset_regresion_activos").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")).where(sql`(activo_dataset = true)`),
	index("idx_dataset_regresion_activos_fecha").using("btree", table.fechaInicio.desc().nullsFirst().op("date_ops")).where(sql`(activo_dataset = true)`),
	index("idx_dataset_regresion_categoria").using("btree", table.categoriaId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_regresion_categoria_modalidad").using("btree", table.categoriaId.asc().nullsLast().op("int4_ops"), table.modalidadId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_regresion_fecha_inicio").using("btree", table.fechaInicio.asc().nullsLast().op("date_ops")),
	index("idx_dataset_regresion_fecha_ocupacion").using("btree", table.fechaInicio.asc().nullsLast().op("numeric_ops"), table.porcentajeOcupacion.asc().nullsLast().op("date_ops")),
	index("idx_dataset_regresion_modalidad").using("btree", table.modalidadId.asc().nullsLast().op("int4_ops")),
	index("idx_dataset_regresion_ocupacion").using("btree", table.porcentajeOcupacion.asc().nullsLast().op("numeric_ops")),
	index("idx_dataset_regresion_precio").using("btree", table.precioHistorico.asc().nullsLast().op("numeric_ops")),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_dataset_regresion_curso"
		}).onDelete("restrict"),
	unique("dataset_regresion_precio_cursos_curso_id_key").on(table.cursoId),
	check("chk_dataset_regresion_anio", sql`(anio_inicio IS NULL) OR (anio_inicio >= 2000)`),
	check("chk_dataset_regresion_anticipacion", sql`(dias_anticipacion_primera_compra IS NULL) OR (dias_anticipacion_primera_compra >= 0)`),
	check("chk_dataset_regresion_compras", sql`(total_compras >= 0) AND (compras_validas >= 0) AND (compradores_unicos >= 0)`),
	check("chk_dataset_regresion_cupos", sql`(cupo_maximo >= 0) AND (cupos_ocupados >= 0) AND (cupos_vendidos >= 0)`),
	check("chk_dataset_regresion_duracion", sql`(duracion_dias IS NULL) OR (duracion_dias >= 0)`),
	check("chk_dataset_regresion_mes", sql`(mes_inicio IS NULL) OR ((mes_inicio >= 1) AND (mes_inicio <= 12))`),
	check("chk_dataset_regresion_montos", sql`(ingresos_aprobados >= (0)::numeric) AND (precio_historico >= (0)::numeric) AND (ingreso_promedio_por_cupo >= (0)::numeric) AND ((precio_sugerido_modelo IS NULL) OR (precio_sugerido_modelo >= (0)::numeric))`),
	check("chk_dataset_regresion_ocupacion", sql`(porcentaje_ocupacion >= (0)::numeric) AND (porcentaje_ocupacion <= (100)::numeric)`),
	check("chk_dataset_regresion_ultima_compra", sql`(dias_anticipacion_ultima_compra IS NULL) OR (dias_anticipacion_ultima_compra >= 0)`),
]);

export const colaActualizacionDatasetsInAnalitica = analitica.table("cola_actualizacion_datasets", {
	idTarea: bigserial("id_tarea", { mode: "bigint" }).primaryKey().notNull(),
	datasetDestino: varchar("dataset_destino", { length: 40 }).notNull(),
	tablaOrigen: varchar("tabla_origen", { length: 100 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	registroOrigenId: bigint("registro_origen_id", { mode: "number" }),
	tipoOperacion: varchar("tipo_operacion", { length: 20 }).notNull(),
	prioridad: smallint().default(5).notNull(),
	estado: varchar({ length: 20 }).default('Pendiente').notNull(),
	intentos: smallint().default(0).notNull(),
	fechaEvento: timestamp("fecha_evento", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	fechaProgramada: timestamp("fecha_programada", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	fechaInicioProceso: timestamp("fecha_inicio_proceso", { mode: 'string' }),
	fechaFinProceso: timestamp("fecha_fin_proceso", { mode: 'string' }),
	ultimoError: text("ultimo_error"),
	payload: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_cola_datasets_completadas_recientes").using("btree", table.fechaFinProceso.desc().nullsFirst().op("timestamp_ops")).where(sql`((estado)::text = 'Completada'::text)`),
	index("idx_cola_datasets_destino").using("btree", table.datasetDestino.asc().nullsLast().op("text_ops")),
	index("idx_cola_datasets_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_cola_datasets_fallidas").using("btree", table.intentos.asc().nullsLast().op("timestamp_ops"), table.fechaFinProceso.desc().nullsFirst().op("timestamp_ops")).where(sql`((estado)::text = 'Fallida'::text)`),
	index("idx_cola_datasets_fecha_programada").using("btree", table.fechaProgramada.asc().nullsLast().op("timestamp_ops")),
	index("idx_cola_datasets_origen").using("btree", table.tablaOrigen.asc().nullsLast().op("int8_ops"), table.registroOrigenId.asc().nullsLast().op("text_ops")),
	index("idx_cola_datasets_origen_estado").using("btree", table.tablaOrigen.asc().nullsLast().op("text_ops"), table.registroOrigenId.asc().nullsLast().op("text_ops"), table.estado.asc().nullsLast().op("int8_ops")),
	index("idx_cola_datasets_pendientes").using("btree", table.prioridad.asc().nullsLast().op("int2_ops"), table.fechaProgramada.asc().nullsLast().op("int2_ops"), table.idTarea.asc().nullsLast().op("timestamp_ops")).where(sql`((estado)::text = 'Pendiente'::text)`),
	check("chk_cola_completada", sql`((estado)::text <> 'Completada'::text) OR (fecha_fin_proceso IS NOT NULL)`),
	check("chk_cola_dataset_destino", sql`(dataset_destino)::text = ANY ((ARRAY['Reglas de asociación'::character varying, 'Segmentación de clientes'::character varying, 'Regresión de precios'::character varying, 'Todos'::character varying])::text[])`),
	check("chk_cola_estado", sql`(estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'Procesando'::character varying, 'Completada'::character varying, 'Fallida'::character varying, 'Cancelada'::character varying])::text[])`),
	check("chk_cola_fallida", sql`((estado)::text <> 'Fallida'::text) OR ((ultimo_error IS NOT NULL) AND (length(TRIM(BOTH FROM ultimo_error)) > 0))`),
	check("chk_cola_fechas_proceso", sql`(fecha_inicio_proceso IS NULL) OR (fecha_fin_proceso IS NULL) OR (fecha_fin_proceso >= fecha_inicio_proceso)`),
	check("chk_cola_intentos", sql`intentos >= 0`),
	check("chk_cola_prioridad", sql`(prioridad >= 1) AND (prioridad <= 10)`),
	check("chk_cola_procesando", sql`((estado)::text <> 'Procesando'::text) OR (fecha_inicio_proceso IS NOT NULL)`),
	check("chk_cola_tipo_operacion", sql`(tipo_operacion)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying, 'RECALCULO'::character varying])::text[])`),
]);

export const modelosMlInAnalitica = analitica.table("modelos_ml", {
	idModelo: bigserial("id_modelo", { mode: "bigint" }).primaryKey().notNull(),
	nombreModelo: varchar("nombre_modelo", { length: 150 }).notNull(),
	tipoModelo: varchar("tipo_modelo", { length: 40 }).notNull(),
	algoritmo: varchar({ length: 100 }).notNull(),
	versionModelo: varchar("version_modelo", { length: 50 }).notNull(),
	datasetOrigen: varchar("dataset_origen", { length: 100 }).notNull(),
	descripcion: text(),
	parametros: jsonb(),
	metricas: jsonb(),
	rutaArchivoModelo: text("ruta_archivo_modelo"),
	fechaInicioDatos: date("fecha_inicio_datos"),
	fechaFinDatos: date("fecha_fin_datos"),
	cantidadRegistrosEntrenamiento: integer("cantidad_registros_entrenamiento"),
	estado: varchar({ length: 30 }).default('Entrenado').notNull(),
	esModeloActivo: boolean("es_modelo_activo").default(false).notNull(),
	fechaEntrenamiento: timestamp("fecha_entrenamiento", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	fechaDespliegue: timestamp("fecha_despliegue", { withTimezone: true, mode: 'string' }),
	fechaRetiro: timestamp("fecha_retiro", { withTimezone: true, mode: 'string' }),
	creadoPor: integer("creado_por"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_modelos_ml_activos").using("btree", table.tipoModelo.asc().nullsLast().op("text_ops"), table.fechaDespliegue.desc().nullsFirst().op("timestamptz_ops")).where(sql`(es_modelo_activo = true)`),
	index("idx_modelos_ml_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_modelos_ml_fecha_entrenamiento").using("btree", table.fechaEntrenamiento.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_modelos_ml_tipo").using("btree", table.tipoModelo.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_modelos_ml_creado_por"
		}).onDelete("set null"),
	unique("uq_modelos_ml_nombre_version").on(table.nombreModelo, table.versionModelo),
	check("chk_modelos_ml_despliegue", sql`((estado)::text <> 'Desplegado'::text) OR (fecha_despliegue IS NOT NULL)`),
	check("chk_modelos_ml_estado", sql`(estado)::text = ANY ((ARRAY['Entrenando'::character varying, 'Entrenado'::character varying, 'Validado'::character varying, 'Desplegado'::character varying, 'Fallido'::character varying, 'Retirado'::character varying])::text[])`),
	check("chk_modelos_ml_periodo", sql`(fecha_inicio_datos IS NULL) OR (fecha_fin_datos IS NULL) OR (fecha_fin_datos >= fecha_inicio_datos)`),
	check("chk_modelos_ml_registros", sql`(cantidad_registros_entrenamiento IS NULL) OR (cantidad_registros_entrenamiento >= 0)`),
	check("chk_modelos_ml_retirado", sql`((estado)::text <> 'Retirado'::text) OR (fecha_retiro IS NOT NULL)`),
	check("chk_modelos_ml_tipo", sql`(tipo_modelo)::text = ANY ((ARRAY['Reglas de asociación'::character varying, 'Segmentación de clientes'::character varying, 'Regresión de precios'::character varying])::text[])`),
]);

export const recomendacionesCursosInAnalitica = analitica.table("recomendaciones_cursos", {
	idRecomendacion: bigserial("id_recomendacion", { mode: "bigint" }).primaryKey().notNull(),
	usuarioId: integer("usuario_id").notNull(),
	cursoRecomendadoId: integer("curso_recomendado_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	modeloId: bigint("modelo_id", { mode: "number" }).notNull(),
	cursoOrigenId: integer("curso_origen_id"),
	reglaOrigen: jsonb("regla_origen"),
	soporte: numeric({ precision: 10, scale:  6 }),
	confianza: numeric({ precision: 10, scale:  6 }),
	lift: numeric({ precision: 10, scale:  6 }),
	puntuacionRecomendacion: numeric("puntuacion_recomendacion", { precision: 10, scale:  6 }),
	motivoRecomendacion: text("motivo_recomendacion"),
	fechaGeneracion: timestamp("fecha_generacion", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	fechaExpiracion: timestamp("fecha_expiracion", { withTimezone: true, mode: 'string' }),
	estado: varchar({ length: 20 }).default('Activa').notNull(),
	visibleUsuario: boolean("visible_usuario").default(true).notNull(),
	fechaVista: timestamp("fecha_vista", { withTimezone: true, mode: 'string' }),
	fechaAceptacion: timestamp("fecha_aceptacion", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_recomendaciones_curso").using("btree", table.cursoRecomendadoId.asc().nullsLast().op("int4_ops")),
	index("idx_recomendaciones_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_recomendaciones_expiracion").using("btree", table.fechaExpiracion.asc().nullsLast().op("timestamptz_ops")).where(sql`((estado)::text = 'Activa'::text)`),
	index("idx_recomendaciones_modelo").using("btree", table.modeloId.asc().nullsLast().op("int8_ops")),
	index("idx_recomendaciones_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	index("idx_recomendaciones_usuario_estado").using("btree", table.usuarioId.asc().nullsLast().op("text_ops"), table.estado.asc().nullsLast().op("int4_ops"), table.puntuacionRecomendacion.desc().nullsFirst().op("int4_ops")),
	foreignKey({
			columns: [table.cursoRecomendadoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_recomendaciones_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.cursoOrigenId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_recomendaciones_curso_origen"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.modeloId],
			foreignColumns: [modelosMlInAnalitica.idModelo],
			name: "fk_recomendaciones_modelo"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_recomendaciones_usuario"
		}).onDelete("cascade"),
	check("chk_recomendaciones_aceptacion", sql`(fecha_aceptacion IS NULL) OR (fecha_aceptacion >= fecha_generacion)`),
	check("chk_recomendaciones_confianza", sql`(confianza IS NULL) OR ((confianza >= (0)::numeric) AND (confianza <= (1)::numeric))`),
	check("chk_recomendaciones_estado", sql`(estado)::text = ANY ((ARRAY['Activa'::character varying, 'Vista'::character varying, 'Aceptada'::character varying, 'Descartada'::character varying, 'Expirada'::character varying])::text[])`),
	check("chk_recomendaciones_expiracion", sql`(fecha_expiracion IS NULL) OR (fecha_expiracion >= fecha_generacion)`),
	check("chk_recomendaciones_lift", sql`(lift IS NULL) OR (lift >= (0)::numeric)`),
	check("chk_recomendaciones_puntuacion", sql`(puntuacion_recomendacion IS NULL) OR (puntuacion_recomendacion >= (0)::numeric)`),
	check("chk_recomendaciones_soporte", sql`(soporte IS NULL) OR ((soporte >= (0)::numeric) AND (soporte <= (1)::numeric))`),
	check("chk_recomendaciones_vista", sql`(fecha_vista IS NULL) OR (fecha_vista >= fecha_generacion)`),
]);

export const segmentosClientesInAnalitica = analitica.table("segmentos_clientes", {
	idSegmentacion: bigserial("id_segmentacion", { mode: "bigint" }).primaryKey().notNull(),
	usuarioId: integer("usuario_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	modeloId: bigint("modelo_id", { mode: "number" }).notNull(),
	numeroSegmento: integer("numero_segmento").notNull(),
	nombreSegmento: varchar("nombre_segmento", { length: 100 }).notNull(),
	descripcionSegmento: text("descripcion_segmento"),
	distanciaCentroide: numeric("distancia_centroide", { precision: 14, scale:  6 }),
	nivelConfianza: numeric("nivel_confianza", { precision: 5, scale:  2 }),
	caracteristicasUsuario: jsonb("caracteristicas_usuario"),
	fechaAsignacion: timestamp("fecha_asignacion", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	vigente: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_segmentos_clientes_fecha").using("btree", table.fechaAsignacion.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_segmentos_clientes_modelo").using("btree", table.modeloId.asc().nullsLast().op("int8_ops")),
	index("idx_segmentos_clientes_nombre").using("btree", table.nombreSegmento.asc().nullsLast().op("text_ops")),
	index("idx_segmentos_clientes_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_segmento_vigente_usuario_modelo").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops"), table.modeloId.asc().nullsLast().op("int4_ops")).where(sql`(vigente = true)`),
	foreignKey({
			columns: [table.modeloId],
			foreignColumns: [modelosMlInAnalitica.idModelo],
			name: "fk_segmentos_cliente_modelo"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_segmentos_cliente_usuario"
		}).onDelete("cascade"),
	check("chk_segmentos_confianza", sql`(nivel_confianza IS NULL) OR ((nivel_confianza >= (0)::numeric) AND (nivel_confianza <= (100)::numeric))`),
	check("chk_segmentos_distancia", sql`(distancia_centroide IS NULL) OR (distancia_centroide >= (0)::numeric)`),
	check("chk_segmentos_numero", sql`numero_segmento >= 0`),
]);

export const prediccionesPrecioCursosInAnalitica = analitica.table("predicciones_precio_cursos", {
	idPrediccion: bigserial("id_prediccion", { mode: "bigint" }).primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	modeloId: bigint("modelo_id", { mode: "number" }).notNull(),
	precioActual: numeric("precio_actual", { precision: 10, scale:  2 }).notNull(),
	precioSugerido: numeric("precio_sugerido", { precision: 10, scale:  2 }).notNull(),
	precioMinimoEstimado: numeric("precio_minimo_estimado", { precision: 10, scale:  2 }),
	precioMaximoEstimado: numeric("precio_maximo_estimado", { precision: 10, scale:  2 }),
	variacionAbsoluta: numeric("variacion_absoluta", { precision: 10, scale:  2 }),
	variacionPorcentual: numeric("variacion_porcentual", { precision: 8, scale:  2 }),
	nivelConfianza: numeric("nivel_confianza", { precision: 5, scale:  2 }),
	variablesEntrada: jsonb("variables_entrada"),
	explicacion: jsonb(),
	fechaPrediccion: timestamp("fecha_prediccion", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	estado: varchar({ length: 30 }).default('Pendiente de revisión').notNull(),
	decisionAdministrativa: varchar("decision_administrativa", { length: 20 }),
	motivoDecision: text("motivo_decision"),
	precioAplicado: numeric("precio_aplicado", { precision: 10, scale:  2 }),
	usuarioDecide: integer("usuario_decide"),
	fechaDecision: timestamp("fecha_decision", { withTimezone: true, mode: 'string' }),
	vigente: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_predicciones_precio_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_predicciones_precio_curso_fecha").using("btree", table.cursoId.asc().nullsLast().op("int4_ops"), table.fechaPrediccion.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_predicciones_precio_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_predicciones_precio_fecha").using("btree", table.fechaPrediccion.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_predicciones_precio_modelo").using("btree", table.modeloId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_prediccion_vigente_curso_modelo").using("btree", table.cursoId.asc().nullsLast().op("int4_ops"), table.modeloId.asc().nullsLast().op("int4_ops")).where(sql`(vigente = true)`),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_predicciones_precio_curso"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.modeloId],
			foreignColumns: [modelosMlInAnalitica.idModelo],
			name: "fk_predicciones_precio_modelo"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.usuarioDecide],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_predicciones_precio_usuario_decide"
		}).onDelete("set null"),
	check("chk_predicciones_aplicada", sql`((estado)::text <> 'Aplicada'::text) OR (((decision_administrativa)::text = ANY ((ARRAY['Aceptada'::character varying, 'Modificada'::character varying])::text[])) AND (precio_aplicado IS NOT NULL))`),
	check("chk_predicciones_confianza", sql`(nivel_confianza IS NULL) OR ((nivel_confianza >= (0)::numeric) AND (nivel_confianza <= (100)::numeric))`),
	check("chk_predicciones_decision", sql`(decision_administrativa IS NULL) OR ((decision_administrativa)::text = ANY ((ARRAY['Aceptada'::character varying, 'Modificada'::character varying, 'Rechazada'::character varying])::text[]))`),
	check("chk_predicciones_decision_completa", sql`(decision_administrativa IS NULL) OR ((usuario_decide IS NOT NULL) AND (fecha_decision IS NOT NULL))`),
	check("chk_predicciones_estado", sql`(estado)::text = ANY ((ARRAY['Pendiente de revisión'::character varying, 'Revisada'::character varying, 'Aplicada'::character varying, 'Descartada'::character varying, 'Expirada'::character varying])::text[])`),
	check("chk_predicciones_intervalo", sql`(precio_minimo_estimado IS NULL) OR (precio_maximo_estimado IS NULL) OR (precio_maximo_estimado >= precio_minimo_estimado)`),
	check("chk_predicciones_precio_actual", sql`precio_actual >= (0)::numeric`),
	check("chk_predicciones_precio_aplicado", sql`(precio_aplicado IS NULL) OR (precio_aplicado >= (0)::numeric)`),
	check("chk_predicciones_precio_maximo", sql`(precio_maximo_estimado IS NULL) OR (precio_maximo_estimado >= (0)::numeric)`),
	check("chk_predicciones_precio_minimo", sql`(precio_minimo_estimado IS NULL) OR (precio_minimo_estimado >= (0)::numeric)`),
	check("chk_predicciones_precio_sugerido", sql`precio_sugerido >= (0)::numeric`),
]);

export const backupsInAuditoria = auditoria.table("backups", {
	id: serial().primaryKey().notNull(),
	fecha: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	tipo: varchar({ length: 20 }).notNull(),
	"tamaño": varchar("tamaño", { length: 20 }),
	archivoUrl: text("archivo_url"),
	estado: varchar({ length: 20 }).default('exitoso'),
	// TODO: failed to parse database type 'bytea'
	contenido: bytea("contenido"),
	nombreArchivo: text("nombre_archivo"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	"tamañoBytes": bigint("tamaño_bytes", { mode: "number" }),
}, (table) => [
	index("idx_backups_fecha").using("btree", table.fecha.desc().nullsFirst().op("timestamp_ops")),
	index("idx_backups_tipo").using("btree", table.tipo.asc().nullsLast().op("text_ops")),
]);
export const vwDetalleParticipantesCursosInAcademia = academia.view("vw_detalle_participantes_cursos", {	idInscripcion: integer("id_inscripcion"),
	cursoId: integer("curso_id"),
	tituloCurso: varchar("titulo_curso", { length: 200 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participanteId: bigint("participante_id", { mode: "number" }),
	nombreParticipante: text("nombre_participante"),
	fechaNacimiento: date("fecha_nacimiento"),
	sexo: varchar({ length: 20 }),
	correoParticipante: varchar("correo_participante", { length: 150 }),
	telefonoParticipante: varchar("telefono_participante", { length: 20 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	compraParticipanteId: bigint("compra_participante_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCompra: bigint("id_compra", { mode: "number" }),
	folioCompra: varchar("folio_compra", { length: 20 }),
	compradorId: integer("comprador_id"),
	nombreComprador: text("nombre_comprador"),
	correoComprador: text("correo_comprador"),
	fechaInscripcion: timestamp("fecha_inscripcion", { mode: 'string' }),
	fechaConfirmacion: timestamp("fecha_confirmacion", { mode: 'string' }),
	estadoInscripcion: varchar("estado_inscripcion", { length: 20 }),
	origenInscripcion: varchar("origen_inscripcion", { length: 25 }),
	estadoAcademico: varchar("estado_academico", { length: 20 }),
	sesionesTotales: integer("sesiones_totales"),
	sesionesCompletadas: integer("sesiones_completadas"),
	porcentajeAvance: numeric("porcentaje_avance"),
	porcentajeAsistencia: numeric("porcentaje_asistencia"),
	fechaInicio: timestamp("fecha_inicio", { mode: 'string' }),
	fechaUltimaActividad: timestamp("fecha_ultima_actividad", { mode: 'string' }),
	fechaFinalizacion: timestamp("fecha_finalizacion", { mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesConAsistenciaRegistrada: bigint("sesiones_con_asistencia_registrada", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	asistenciasPresentes: bigint("asistencias_presentes", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	retardos: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ausencias: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	faltasJustificadas: bigint("faltas_justificadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	salidasAnticipadas: bigint("salidas_anticipadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesCalificadas: bigint("evaluaciones_calificadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesAprobadas: bigint("evaluaciones_aprobadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesNoAprobadas: bigint("evaluaciones_no_aprobadas", { mode: "number" }),
	promedioEvaluaciones: numeric("promedio_evaluaciones"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCertificado: bigint("id_certificado", { mode: "number" }),
	folioCertificado: varchar("folio_certificado", { length: 40 }),
	codigoVerificacion: varchar("codigo_verificacion", { length: 100 }),
	estadoCertificado: varchar("estado_certificado", { length: 20 }),
	fechaEmisionCertificado: timestamp("fecha_emision_certificado", { mode: 'string' }),
	fechaRevocacionCertificado: timestamp("fecha_revocacion_certificado", { mode: 'string' }),
	situacionCertificado: varchar("situacion_certificado"),
}).as(sql`WITH resumen_asistencias AS ( SELECT ac.inscripcion_id, count(*) FILTER (WHERE ac.estado_asistencia::text <> 'Pendiente'::text) AS sesiones_registradas, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Presente'::text) AS asistencias_presentes, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Retardo'::text) AS retardos, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Ausente'::text) AS ausencias, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Falta justificada'::text) AS faltas_justificadas, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Salida anticipada'::text) AS salidas_anticipadas FROM academia.asistencias_curso ac GROUP BY ac.inscripcion_id ), resumen_evaluaciones AS ( SELECT re_1.inscripcion_id, count(DISTINCT re_1.evaluacion_id) FILTER (WHERE re_1.estado_resultado::text = 'Calificado'::text) AS evaluaciones_calificadas, count(DISTINCT re_1.evaluacion_id) FILTER (WHERE re_1.estado_resultado::text = 'Calificado'::text AND re_1.aprobado = true) AS evaluaciones_aprobadas, count(DISTINCT re_1.evaluacion_id) FILTER (WHERE re_1.estado_resultado::text = 'Calificado'::text AND re_1.aprobado = false) AS evaluaciones_no_aprobadas, round(avg(re_1.porcentaje_obtenido) FILTER (WHERE re_1.estado_resultado::text = 'Calificado'::text AND re_1.porcentaje_obtenido IS NOT NULL), 2) AS promedio_evaluaciones FROM academia.resultados_evaluaciones re_1 GROUP BY re_1.inscripcion_id ) SELECT ic.id_inscripcion, ic.curso_id, c.titulo_curso, ic.participante_id, TRIM(BOTH FROM concat_ws(' '::text, p.nombre, p.apellido_paterno, p.apellido_materno)) AS nombre_participante, p.fecha_nacimiento, p.sexo, p.correo AS correo_participante, p.telefono AS telefono_participante, ic.compra_participante_id, cp.id_compra, cc.foliocompra AS folio_compra, cc.idusuario AS comprador_id, TRIM(BOTH FROM concat_ws(' '::text, u.nombre, u."apellidoPaterno", u."apellidoMaterno")) AS nombre_comprador, u.correo AS correo_comprador, ic.fecha_inscripcion, ic.fecha_confirmacion, ic.estado AS estado_inscripcion, ic.origen_inscripcion, pc.estado_academico, COALESCE(pc.sesiones_totales::integer, 0) AS sesiones_totales, COALESCE(pc.sesiones_completadas::integer, 0) AS sesiones_completadas, COALESCE(pc.porcentaje_avance, 0::numeric) AS porcentaje_avance, COALESCE(pc.porcentaje_asistencia, 0::numeric) AS porcentaje_asistencia, pc.fecha_inicio, pc.fecha_ultima_actividad, pc.fecha_finalizacion, COALESCE(ra.sesiones_registradas, 0::bigint) AS sesiones_con_asistencia_registrada, COALESCE(ra.asistencias_presentes, 0::bigint) AS asistencias_presentes, COALESCE(ra.retardos, 0::bigint) AS retardos, COALESCE(ra.ausencias, 0::bigint) AS ausencias, COALESCE(ra.faltas_justificadas, 0::bigint) AS faltas_justificadas, COALESCE(ra.salidas_anticipadas, 0::bigint) AS salidas_anticipadas, COALESCE(re.evaluaciones_calificadas, 0::bigint) AS evaluaciones_calificadas, COALESCE(re.evaluaciones_aprobadas, 0::bigint) AS evaluaciones_aprobadas, COALESCE(re.evaluaciones_no_aprobadas, 0::bigint) AS evaluaciones_no_aprobadas, re.promedio_evaluaciones, cert.id_certificado, cert.folio_certificado, cert.codigo_verificacion, cert.estado AS estado_certificado, cert.fecha_emision AS fecha_emision_certificado, cert.fecha_revocacion AS fecha_revocacion_certificado, CASE WHEN cert.id_certificado IS NULL THEN 'Sin certificado'::character varying WHEN cert.estado::text = 'Emitido'::text THEN 'Certificado vigente'::character varying WHEN cert.estado::text = 'Generado'::text THEN 'Pendiente de emisión'::character varying WHEN cert.estado::text = 'Revocado'::text THEN 'Certificado revocado'::character varying WHEN cert.estado::text = 'Anulado'::text THEN 'Certificado anulado'::character varying ELSE cert.estado END AS situacion_certificado FROM academia.inscripciones_cursos ic JOIN academia.cursos c ON c.id_curso = ic.curso_id LEFT JOIN academia.participantes p ON p.id_participante = ic.participante_id LEFT JOIN academia.compra_participantes cp ON cp.id_compra_participante = ic.compra_participante_id LEFT JOIN academia.comprascursosinacademia cc ON cc.idcompra = cp.id_compra LEFT JOIN seguridad.usuarios u ON u.id = cc.idusuario LEFT JOIN academia.progreso_curso pc ON pc.inscripcion_id = ic.id_inscripcion LEFT JOIN resumen_asistencias ra ON ra.inscripcion_id = ic.id_inscripcion LEFT JOIN resumen_evaluaciones re ON re.inscripcion_id = ic.id_inscripcion LEFT JOIN academia.certificados_curso cert ON cert.inscripcion_id = ic.id_inscripcion`);

export const vwOcupacionCursosInAcademia = academia.view("vw_ocupacion_cursos", {	cursoId: integer("curso_id"),
	tituloCurso: varchar("titulo_curso", { length: 200 }),
	estadoCurso: text("estado_curso"),
	cupoMaximo: integer("cupo_maximo"),
	cuposOcupados: integer("cupos_ocupados"),
	cuposDisponibles: integer("cupos_disponibles"),
	porcentajeOcupacion: numeric("porcentaje_ocupacion"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCompras: bigint("total_compras", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasActivas: bigint("compras_activas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPendientesPago: bigint("compras_pendientes_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoReportado: bigint("compras_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasAprobadas: bigint("compras_aprobadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposCompradosActivos: bigint("cupos_comprados_activos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesRegistrados: bigint("participantes_registrados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesInscritosDesdeCompra: bigint("participantes_inscritos_desde_compra", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalInscripciones: bigint("total_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesActivas: bigint("inscripciones_activas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesCompletadas: bigint("inscripciones_completadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesCanceladas: bigint("inscripciones_canceladas", { mode: "number" }),
	importeComprasActivas: numeric("importe_compras_activas"),
	ingresosAprobados: numeric("ingresos_aprobados"),
	montoEnRevision: numeric("monto_en_revision"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevision: bigint("pagos_en_revision", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazados: bigint("pagos_rechazados", { mode: "number" }),
	nivelOcupacion: text("nivel_ocupacion"),
	cuposConsistentesConCompras: boolean("cupos_consistentes_con_compras"),
}).as(sql`WITH compras_por_curso AS ( SELECT cc.idcurso AS curso_id, count(*) AS total_compras, count(*) FILTER (WHERE ec.nombre::text <> ALL (ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying]::text[])) AS compras_activas, count(*) FILTER (WHERE ec.nombre::text = 'Pendiente de pago'::text) AS compras_pendientes_pago, count(*) FILTER (WHERE ec.nombre::text = 'Pago reportado'::text) AS compras_pago_reportado, count(*) FILTER (WHERE ec.nombre::text = ANY (ARRAY['Pago validado'::character varying, 'Inscripciones generadas'::character varying]::text[])) AS compras_aprobadas, COALESCE(sum(cc.cantidadcupos) FILTER (WHERE ec.nombre::text <> ALL (ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying]::text[])), 0::bigint) AS cupos_comprados_activos, COALESCE(sum(cc.total) FILTER (WHERE ec.nombre::text <> ALL (ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying]::text[])), 0::numeric) AS importe_compras_activas FROM academia.comprascursosinacademia cc JOIN academia.estadocomprainacademia ec ON ec.idestadocompra = cc.idestadocompra GROUP BY cc.idcurso ), participantes_por_curso AS ( SELECT cc.idcurso AS curso_id, count(*) FILTER (WHERE cp.estado::text <> 'Cancelado'::text) AS participantes_registrados, count(*) FILTER (WHERE cp.estado::text = 'Inscrito'::text) AS participantes_convertidos_inscripcion FROM academia.compra_participantes cp JOIN academia.comprascursosinacademia cc ON cc.idcompra = cp.id_compra GROUP BY cc.idcurso ), inscripciones_por_curso AS ( SELECT ic.curso_id, count(*) AS total_inscripciones, count(*) FILTER (WHERE ic.estado::text = 'Activo'::text) AS inscripciones_activas, count(*) FILTER (WHERE ic.estado::text = 'Completado'::text) AS inscripciones_completadas, count(*) FILTER (WHERE ic.estado::text = 'Cancelado'::text) AS inscripciones_canceladas FROM academia.inscripciones_cursos ic GROUP BY ic.curso_id ), pagos_por_curso AS ( SELECT cc.idcurso AS curso_id, COALESCE(sum(pc.monto) FILTER (WHERE pc.estado::text = 'Aprobado'::text), 0::numeric) AS ingresos_aprobados, COALESCE(sum(pc.monto) FILTER (WHERE pc.estado::text = 'En revisión'::text), 0::numeric) AS monto_en_revision, count(*) FILTER (WHERE pc.estado::text = 'En revisión'::text) AS pagos_en_revision, count(*) FILTER (WHERE pc.estado::text = 'Rechazado'::text) AS pagos_rechazados FROM academia.pagos_cursos pc JOIN academia.comprascursosinacademia cc ON cc.idcompra = pc.id_compra GROUP BY cc.idcurso ) SELECT c.id_curso AS curso_id, c.titulo_curso, CASE WHEN c.activo = true THEN 'Activo'::text ELSE 'Inactivo'::text END AS estado_curso, c.cupo_maximo, COALESCE(c.cupos_ocupados, 0) AS cupos_ocupados, GREATEST(c.cupo_maximo - COALESCE(c.cupos_ocupados, 0), 0) AS cupos_disponibles, CASE WHEN c.cupo_maximo IS NULL OR c.cupo_maximo = 0 THEN 0::numeric ELSE round(COALESCE(c.cupos_ocupados, 0)::numeric / c.cupo_maximo::numeric * 100::numeric, 2) END AS porcentaje_ocupacion, COALESCE(cpc.total_compras, 0::bigint) AS total_compras, COALESCE(cpc.compras_activas, 0::bigint) AS compras_activas, COALESCE(cpc.compras_pendientes_pago, 0::bigint) AS compras_pendientes_pago, COALESCE(cpc.compras_pago_reportado, 0::bigint) AS compras_pago_reportado, COALESCE(cpc.compras_aprobadas, 0::bigint) AS compras_aprobadas, COALESCE(cpc.cupos_comprados_activos, 0::bigint) AS cupos_comprados_activos, COALESCE(ppc.participantes_registrados, 0::bigint) AS participantes_registrados, COALESCE(ppc.participantes_convertidos_inscripcion, 0::bigint) AS participantes_inscritos_desde_compra, COALESCE(ipc.total_inscripciones, 0::bigint) AS total_inscripciones, COALESCE(ipc.inscripciones_activas, 0::bigint) AS inscripciones_activas, COALESCE(ipc.inscripciones_completadas, 0::bigint) AS inscripciones_completadas, COALESCE(ipc.inscripciones_canceladas, 0::bigint) AS inscripciones_canceladas, COALESCE(cpc.importe_compras_activas, 0::numeric) AS importe_compras_activas, COALESCE(pgc.ingresos_aprobados, 0::numeric) AS ingresos_aprobados, COALESCE(pgc.monto_en_revision, 0::numeric) AS monto_en_revision, COALESCE(pgc.pagos_en_revision, 0::bigint) AS pagos_en_revision, COALESCE(pgc.pagos_rechazados, 0::bigint) AS pagos_rechazados, CASE WHEN c.cupo_maximo IS NULL OR c.cupo_maximo = 0 THEN 'Sin cupo configurado'::text WHEN COALESCE(c.cupos_ocupados, 0) >= c.cupo_maximo THEN 'Cupo completo'::text WHEN (COALESCE(c.cupos_ocupados, 0)::numeric / c.cupo_maximo::numeric) >= 0.80 THEN 'Ocupación alta'::text WHEN (COALESCE(c.cupos_ocupados, 0)::numeric / c.cupo_maximo::numeric) >= 0.40 THEN 'Ocupación media'::text ELSE 'Ocupación baja'::text END AS nivel_ocupacion, CASE WHEN COALESCE(c.cupos_ocupados, 0) = COALESCE(cpc.cupos_comprados_activos, 0::bigint) THEN true ELSE false END AS cupos_consistentes_con_compras FROM academia.cursos c LEFT JOIN compras_por_curso cpc ON cpc.curso_id = c.id_curso LEFT JOIN participantes_por_curso ppc ON ppc.curso_id = c.id_curso LEFT JOIN inscripciones_por_curso ipc ON ipc.curso_id = c.id_curso LEFT JOIN pagos_por_curso pgc ON pgc.curso_id = c.id_curso`);

export const vwSeguimientoAcademicoCursosInAcademia = academia.view("vw_seguimiento_academico_cursos", {	cursoId: integer("curso_id"),
	tituloCurso: varchar("titulo_curso", { length: 200 }),
	estadoCurso: text("estado_curso"),
	cupoMaximo: integer("cupo_maximo"),
	cuposOcupados: integer("cupos_ocupados"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalSesiones: bigint("total_sesiones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesProgramadas: bigint("sesiones_programadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesEnCurso: bigint("sesiones_en_curso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesFinalizadas: bigint("sesiones_finalizadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesCanceladas: bigint("sesiones_canceladas", { mode: "number" }),
	primeraFechaSesion: date("primera_fecha_sesion"),
	ultimaFechaSesion: date("ultima_fecha_sesion"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalInscripciones: bigint("total_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesConParticipante: bigint("inscripciones_con_participante", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesPorCompra: bigint("inscripciones_por_compra", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesAdministrativas: bigint("inscripciones_administrativas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesSistemaAnterior: bigint("inscripciones_sistema_anterior", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesNoIniciados: bigint("participantes_no_iniciados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesEnProgreso: bigint("participantes_en_progreso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesCompletados: bigint("participantes_completados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesNoAprobados: bigint("participantes_no_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesAbandonaron: bigint("participantes_abandonaron", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesSuspendidos: bigint("participantes_suspendidos", { mode: "number" }),
	promedioAvance: numeric("promedio_avance"),
	promedioAsistencia: numeric("promedio_asistencia"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalEvaluaciones: bigint("total_evaluaciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesObligatorias: bigint("evaluaciones_obligatorias", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesFinales: bigint("evaluaciones_finales", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesPublicadas: bigint("evaluaciones_publicadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	evaluacionesCerradas: bigint("evaluaciones_cerradas", { mode: "number" }),
	ponderacionTotal: numeric("ponderacion_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesEvaluados: bigint("participantes_evaluados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	intentosCalificados: bigint("intentos_calificados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	intentosAprobados: bigint("intentos_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	intentosNoAprobados: bigint("intentos_no_aprobados", { mode: "number" }),
	promedioResultados: numeric("promedio_resultados"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCertificados: bigint("total_certificados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosGenerados: bigint("certificados_generados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosEmitidos: bigint("certificados_emitidos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosRevocados: bigint("certificados_revocados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosAnulados: bigint("certificados_anulados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	completadosSinCertificado: bigint("completados_sin_certificado", { mode: "number" }),
	situacionAcademica: text("situacion_academica"),
}).as(sql`WITH sesiones_por_curso AS ( SELECT sc.curso_id, count(*) AS total_sesiones, count(*) FILTER (WHERE sc.estado::text = 'Programada'::text) AS sesiones_programadas, count(*) FILTER (WHERE sc.estado::text = 'En curso'::text) AS sesiones_en_curso, count(*) FILTER (WHERE sc.estado::text = 'Finalizada'::text) AS sesiones_finalizadas, count(*) FILTER (WHERE sc.estado::text = 'Cancelada'::text) AS sesiones_canceladas, min(sc.fecha) AS primera_fecha_sesion, max(sc.fecha) AS ultima_fecha_sesion FROM academia.sesiones_curso sc GROUP BY sc.curso_id ), inscripciones_por_curso AS ( SELECT ic.curso_id, count(*) AS total_inscripciones, count(*) FILTER (WHERE ic.participante_id IS NOT NULL) AS inscripciones_con_participante, count(*) FILTER (WHERE ic.origen_inscripcion::text = 'Compra'::text) AS inscripciones_por_compra, count(*) FILTER (WHERE ic.origen_inscripcion::text = 'Administrativa'::text) AS inscripciones_administrativas, count(*) FILTER (WHERE ic.origen_inscripcion::text = 'Sistema anterior'::text) AS inscripciones_sistema_anterior FROM academia.inscripciones_cursos ic GROUP BY ic.curso_id ), progreso_por_curso AS ( SELECT ic.curso_id, count(*) FILTER (WHERE pc.estado_academico::text = 'No iniciado'::text) AS participantes_no_iniciados, count(*) FILTER (WHERE pc.estado_academico::text = 'En progreso'::text) AS participantes_en_progreso, count(*) FILTER (WHERE pc.estado_academico::text = 'Completado'::text) AS participantes_completados, count(*) FILTER (WHERE pc.estado_academico::text = 'No aprobado'::text) AS participantes_no_aprobados, count(*) FILTER (WHERE pc.estado_academico::text = 'Abandonado'::text) AS participantes_abandonaron, count(*) FILTER (WHERE pc.estado_academico::text = 'Suspendido'::text) AS participantes_suspendidos, round(avg(pc.porcentaje_avance), 2) AS promedio_avance, round(avg(pc.porcentaje_asistencia), 2) AS promedio_asistencia FROM academia.inscripciones_cursos ic JOIN academia.progreso_curso pc ON pc.inscripcion_id = ic.id_inscripcion GROUP BY ic.curso_id ), evaluaciones_por_curso AS ( SELECT ec.curso_id, count(*) AS total_evaluaciones, count(*) FILTER (WHERE ec.obligatoria = true) AS evaluaciones_obligatorias, count(*) FILTER (WHERE ec.tipo_evaluacion::text = 'Evaluación final'::text) AS evaluaciones_finales, count(*) FILTER (WHERE ec.estado::text = 'Publicada'::text) AS evaluaciones_publicadas, count(*) FILTER (WHERE ec.estado::text = 'Cerrada'::text) AS evaluaciones_cerradas, COALESCE(sum(ec.ponderacion), 0::numeric) AS ponderacion_total FROM academia.evaluaciones_curso ec WHERE ec.estado::text <> 'Cancelada'::text GROUP BY ec.curso_id ), resultados_por_curso AS ( SELECT ic.curso_id, count(*) FILTER (WHERE re.estado_resultado::text = 'Calificado'::text) AS intentos_calificados, count(*) FILTER (WHERE re.estado_resultado::text = 'Calificado'::text AND re.aprobado = true) AS intentos_aprobados, count(*) FILTER (WHERE re.estado_resultado::text = 'Calificado'::text AND re.aprobado = false) AS intentos_no_aprobados, count(DISTINCT re.inscripcion_id) FILTER (WHERE re.estado_resultado::text = 'Calificado'::text) AS participantes_evaluados, round(avg(re.porcentaje_obtenido) FILTER (WHERE re.estado_resultado::text = 'Calificado'::text AND re.porcentaje_obtenido IS NOT NULL), 2) AS promedio_resultados FROM academia.resultados_evaluaciones re JOIN academia.inscripciones_cursos ic ON ic.id_inscripcion = re.inscripcion_id GROUP BY ic.curso_id ), certificados_por_curso AS ( SELECT ic.curso_id, count(*) AS total_certificados, count(*) FILTER (WHERE cert.estado::text = 'Generado'::text) AS certificados_generados, count(*) FILTER (WHERE cert.estado::text = 'Emitido'::text) AS certificados_emitidos, count(*) FILTER (WHERE cert.estado::text = 'Revocado'::text) AS certificados_revocados, count(*) FILTER (WHERE cert.estado::text = 'Anulado'::text) AS certificados_anulados FROM academia.certificados_curso cert JOIN academia.inscripciones_cursos ic ON ic.id_inscripcion = cert.inscripcion_id GROUP BY ic.curso_id ) SELECT c.id_curso AS curso_id, c.titulo_curso, CASE WHEN c.activo = true THEN 'Activo'::text ELSE 'Inactivo'::text END AS estado_curso, c.cupo_maximo, COALESCE(c.cupos_ocupados, 0) AS cupos_ocupados, COALESCE(spc.total_sesiones, 0::bigint) AS total_sesiones, COALESCE(spc.sesiones_programadas, 0::bigint) AS sesiones_programadas, COALESCE(spc.sesiones_en_curso, 0::bigint) AS sesiones_en_curso, COALESCE(spc.sesiones_finalizadas, 0::bigint) AS sesiones_finalizadas, COALESCE(spc.sesiones_canceladas, 0::bigint) AS sesiones_canceladas, spc.primera_fecha_sesion, spc.ultima_fecha_sesion, COALESCE(ipc.total_inscripciones, 0::bigint) AS total_inscripciones, COALESCE(ipc.inscripciones_con_participante, 0::bigint) AS inscripciones_con_participante, COALESCE(ipc.inscripciones_por_compra, 0::bigint) AS inscripciones_por_compra, COALESCE(ipc.inscripciones_administrativas, 0::bigint) AS inscripciones_administrativas, COALESCE(ipc.inscripciones_sistema_anterior, 0::bigint) AS inscripciones_sistema_anterior, COALESCE(ppc.participantes_no_iniciados, 0::bigint) AS participantes_no_iniciados, COALESCE(ppc.participantes_en_progreso, 0::bigint) AS participantes_en_progreso, COALESCE(ppc.participantes_completados, 0::bigint) AS participantes_completados, COALESCE(ppc.participantes_no_aprobados, 0::bigint) AS participantes_no_aprobados, COALESCE(ppc.participantes_abandonaron, 0::bigint) AS participantes_abandonaron, COALESCE(ppc.participantes_suspendidos, 0::bigint) AS participantes_suspendidos, COALESCE(ppc.promedio_avance, 0::numeric) AS promedio_avance, COALESCE(ppc.promedio_asistencia, 0::numeric) AS promedio_asistencia, COALESCE(epc.total_evaluaciones, 0::bigint) AS total_evaluaciones, COALESCE(epc.evaluaciones_obligatorias, 0::bigint) AS evaluaciones_obligatorias, COALESCE(epc.evaluaciones_finales, 0::bigint) AS evaluaciones_finales, COALESCE(epc.evaluaciones_publicadas, 0::bigint) AS evaluaciones_publicadas, COALESCE(epc.evaluaciones_cerradas, 0::bigint) AS evaluaciones_cerradas, COALESCE(epc.ponderacion_total, 0::numeric) AS ponderacion_total, COALESCE(rpc.participantes_evaluados, 0::bigint) AS participantes_evaluados, COALESCE(rpc.intentos_calificados, 0::bigint) AS intentos_calificados, COALESCE(rpc.intentos_aprobados, 0::bigint) AS intentos_aprobados, COALESCE(rpc.intentos_no_aprobados, 0::bigint) AS intentos_no_aprobados, COALESCE(rpc.promedio_resultados, 0::numeric) AS promedio_resultados, COALESCE(cpc.total_certificados, 0::bigint) AS total_certificados, COALESCE(cpc.certificados_generados, 0::bigint) AS certificados_generados, COALESCE(cpc.certificados_emitidos, 0::bigint) AS certificados_emitidos, COALESCE(cpc.certificados_revocados, 0::bigint) AS certificados_revocados, COALESCE(cpc.certificados_anulados, 0::bigint) AS certificados_anulados, GREATEST(COALESCE(ppc.participantes_completados, 0::bigint) - COALESCE(cpc.certificados_emitidos, 0::bigint), 0::bigint) AS completados_sin_certificado, CASE WHEN COALESCE(spc.total_sesiones, 0::bigint) = 0 THEN 'Sin sesiones'::text WHEN COALESCE(spc.sesiones_finalizadas, 0::bigint) = COALESCE(spc.total_sesiones, 0::bigint) THEN 'Sesiones finalizadas'::text WHEN COALESCE(spc.sesiones_en_curso, 0::bigint) > 0 THEN 'Curso en desarrollo'::text WHEN COALESCE(spc.sesiones_finalizadas, 0::bigint) > 0 THEN 'Curso iniciado'::text ELSE 'Pendiente de inicio'::text END AS situacion_academica FROM academia.cursos c LEFT JOIN sesiones_por_curso spc ON spc.curso_id = c.id_curso LEFT JOIN inscripciones_por_curso ipc ON ipc.curso_id = c.id_curso LEFT JOIN progreso_por_curso ppc ON ppc.curso_id = c.id_curso LEFT JOIN evaluaciones_por_curso epc ON epc.curso_id = c.id_curso LEFT JOIN resultados_por_curso rpc ON rpc.curso_id = c.id_curso LEFT JOIN certificados_por_curso cpc ON cpc.curso_id = c.id_curso`);

export const vwResumenComprasCursosInAcademia = academia.view("vw_resumen_compras_cursos", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCompra: bigint("id_compra", { mode: "number" }),
	folioCompra: varchar("folio_compra", { length: 20 }),
	usuarioCompradorId: integer("usuario_comprador_id"),
	nombreComprador: text("nombre_comprador"),
	correoComprador: text("correo_comprador"),
	cursoId: integer("curso_id"),
	tituloCurso: varchar("titulo_curso", { length: 200 }),
	estadoCompraId: smallint("estado_compra_id"),
	estadoCompra: varchar("estado_compra", { length: 40 }),
	cantidadCupos: smallint("cantidad_cupos"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesRegistrados: bigint("participantes_registrados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesInscritos: bigint("participantes_inscritos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposSinAsignar: bigint("cupos_sin_asignar", { mode: "number" }),
	precioUnitario: numeric("precio_unitario", { precision: 10, scale:  2 }),
	subtotal: numeric({ precision: 10, scale:  2 }),
	descuento: numeric({ precision: 10, scale:  2 }),
	total: numeric({ precision: 10, scale:  2 }),
	totalPagado: numeric("total_pagado"),
	saldoPendiente: numeric("saldo_pendiente"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevision: bigint("pagos_en_revision", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazados: bigint("pagos_rechazados", { mode: "number" }),
	situacionPago: text("situacion_pago"),
	fechaCompra: timestamp("fecha_compra", { mode: 'string' }),
	fechaLimitePago: timestamp("fecha_limite_pago", { mode: 'string' }),
	fechaPagoReportado: timestamp("fecha_pago_reportado", { mode: 'string' }),
	fechaValidacion: timestamp("fecha_validacion", { mode: 'string' }),
	usuarioValidaId: integer("usuario_valida_id"),
	observaciones: text(),
}).as(sql`WITH participantes_por_compra AS ( SELECT cp.id_compra, count(*) FILTER (WHERE cp.estado::text <> 'Cancelado'::text) AS participantes_registrados, count(*) FILTER (WHERE cp.estado::text = 'Inscrito'::text) AS participantes_inscritos FROM academia.compra_participantes cp GROUP BY cp.id_compra ), pagos_por_compra AS ( SELECT pc.id_compra, COALESCE(sum(pc.monto) FILTER (WHERE pc.estado::text = 'Aprobado'::text), 0::numeric) AS total_pagado, count(*) FILTER (WHERE pc.estado::text = 'En revisión'::text) AS pagos_en_revision, count(*) FILTER (WHERE pc.estado::text = 'Rechazado'::text) AS pagos_rechazados FROM academia.pagos_cursos pc GROUP BY pc.id_compra ) SELECT cc.idcompra AS id_compra, cc.foliocompra AS folio_compra, cc.idusuario AS usuario_comprador_id, TRIM(BOTH FROM concat_ws(' '::text, u.nombre, u."apellidoPaterno", u."apellidoMaterno")) AS nombre_comprador, u.correo AS correo_comprador, cc.idcurso AS curso_id, c.titulo_curso, cc.idestadocompra AS estado_compra_id, ec.nombre AS estado_compra, cc.cantidadcupos AS cantidad_cupos, COALESCE(ppc.participantes_registrados, 0::bigint) AS participantes_registrados, COALESCE(ppc.participantes_inscritos, 0::bigint) AS participantes_inscritos, cc.cantidadcupos - COALESCE(ppc.participantes_registrados, 0::bigint) AS cupos_sin_asignar, cc.preciounitario AS precio_unitario, cc.subtotal, cc.descuento, cc.total, COALESCE(ppc2.total_pagado, 0::numeric) AS total_pagado, GREATEST(cc.total - COALESCE(ppc2.total_pagado, 0::numeric), 0::numeric) AS saldo_pendiente, COALESCE(ppc2.pagos_en_revision, 0::bigint) AS pagos_en_revision, COALESCE(ppc2.pagos_rechazados, 0::bigint) AS pagos_rechazados, CASE WHEN COALESCE(ppc2.total_pagado, 0::numeric) >= cc.total THEN 'Pagada'::text WHEN COALESCE(ppc2.total_pagado, 0::numeric) > 0::numeric THEN 'Pago parcial'::text WHEN COALESCE(ppc2.pagos_en_revision, 0::bigint) > 0 THEN 'Pago en revisión'::text ELSE 'Sin pago aprobado'::text END AS situacion_pago, cc.fechacompra AS fecha_compra, cc.fechalimitepago AS fecha_limite_pago, cc.fechapago AS fecha_pago_reportado, cc.fechavalidacion AS fecha_validacion, cc.usuariovalida AS usuario_valida_id, cc.observaciones FROM academia.comprascursosinacademia cc JOIN seguridad.usuarios u ON u.id = cc.idusuario JOIN academia.cursos c ON c.id_curso = cc.idcurso JOIN academia.estadocomprainacademia ec ON ec.idestadocompra = cc.idestadocompra LEFT JOIN participantes_por_compra ppc ON ppc.id_compra = cc.idcompra LEFT JOIN pagos_por_compra ppc2 ON ppc2.id_compra = cc.idcompra`);

export const vwControlPagosCursosInAcademia = academia.view("vw_control_pagos_cursos", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idPago: bigint("id_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idCompra: bigint("id_compra", { mode: "number" }),
	folioCompra: varchar("folio_compra", { length: 20 }),
	compradorId: integer("comprador_id"),
	nombreComprador: text("nombre_comprador"),
	correoComprador: text("correo_comprador"),
	cursoId: integer("curso_id"),
	tituloCurso: varchar("titulo_curso", { length: 200 }),
	estadoCompraId: smallint("estado_compra_id"),
	estadoCompra: varchar("estado_compra", { length: 40 }),
	idMetodoPago: smallint("id_metodo_pago"),
	metodoPago: varchar("metodo_pago", { length: 60 }),
	requiereComprobante: boolean("requiere_comprobante"),
	montoPago: numeric("monto_pago", { precision: 10, scale:  2 }),
	referencia: varchar({ length: 100 }),
	rutaComprobante: text("ruta_comprobante"),
	nombreArchivoOriginal: varchar("nombre_archivo_original", { length: 255 }),
	tipoArchivo: varchar("tipo_archivo", { length: 100 }),
	tieneComprobante: boolean("tiene_comprobante"),
	estadoPago: varchar("estado_pago", { length: 20 }),
	fechaPago: timestamp("fecha_pago", { mode: 'string' }),
	fechaReporte: timestamp("fecha_reporte", { mode: 'string' }),
	fechaValidacion: timestamp("fecha_validacion", { mode: 'string' }),
	usuarioValidaId: integer("usuario_valida_id"),
	nombreUsuarioValida: text("nombre_usuario_valida"),
	motivoRechazo: text("motivo_rechazo"),
	observacionesPago: text("observaciones_pago"),
	cantidadCupos: smallint("cantidad_cupos"),
	precioUnitario: numeric("precio_unitario", { precision: 10, scale:  2 }),
	subtotal: numeric({ precision: 10, scale:  2 }),
	descuento: numeric({ precision: 10, scale:  2 }),
	totalCompra: numeric("total_compra", { precision: 10, scale:  2 }),
	totalAprobadoCompra: numeric("total_aprobado_compra"),
	totalEnRevisionCompra: numeric("total_en_revision_compra"),
	saldoPendiente: numeric("saldo_pendiente"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalIntentosPago: bigint("total_intentos_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosAprobadosCompra: bigint("pagos_aprobados_compra", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevisionCompra: bigint("pagos_en_revision_compra", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazadosCompra: bigint("pagos_rechazados_compra", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosCanceladosCompra: bigint("pagos_cancelados_compra", { mode: "number" }),
	situacionFinancieraCompra: text("situacion_financiera_compra"),
	alertaComprobanteFaltante: boolean("alerta_comprobante_faltante"),
	alertaRechazoSinMotivo: boolean("alerta_rechazo_sin_motivo"),
	alertaValidacionIncompleta: boolean("alerta_validacion_incompleta"),
	fechaCompra: timestamp("fecha_compra", { mode: 'string' }),
	fechaLimitePago: timestamp("fecha_limite_pago", { mode: 'string' }),
}).as(sql`WITH pagos_aprobados_por_compra AS ( SELECT pc_1.id_compra, COALESCE(sum(pc_1.monto) FILTER (WHERE pc_1.estado::text = 'Aprobado'::text), 0::numeric) AS total_aprobado, COALESCE(sum(pc_1.monto) FILTER (WHERE pc_1.estado::text = 'En revisión'::text), 0::numeric) AS total_en_revision, count(*) AS total_intentos_pago, count(*) FILTER (WHERE pc_1.estado::text = 'Aprobado'::text) AS pagos_aprobados, count(*) FILTER (WHERE pc_1.estado::text = 'En revisión'::text) AS pagos_en_revision, count(*) FILTER (WHERE pc_1.estado::text = 'Rechazado'::text) AS pagos_rechazados, count(*) FILTER (WHERE pc_1.estado::text = 'Cancelado'::text) AS pagos_cancelados FROM academia.pagos_cursos pc_1 GROUP BY pc_1.id_compra ) SELECT pc.id_pago, pc.id_compra, cc.foliocompra AS folio_compra, cc.idusuario AS comprador_id, TRIM(BOTH FROM concat_ws(' '::text, comprador.nombre, comprador."apellidoPaterno", comprador."apellidoMaterno")) AS nombre_comprador, comprador.correo AS correo_comprador, cc.idcurso AS curso_id, c.titulo_curso, cc.idestadocompra AS estado_compra_id, ec.nombre AS estado_compra, pc.id_metodo_pago, mp.nombre AS metodo_pago, mp.requiere_comprobante, pc.monto AS monto_pago, pc.referencia, pc.ruta_comprobante, pc.nombre_archivo_original, pc.tipo_archivo, CASE WHEN pc.ruta_comprobante IS NOT NULL AND length(TRIM(BOTH FROM pc.ruta_comprobante)) > 0 THEN true ELSE false END AS tiene_comprobante, pc.estado AS estado_pago, pc.fecha_pago, pc.fecha_reporte, pc.fecha_validacion, pc.usuario_valida AS usuario_valida_id, TRIM(BOTH FROM concat_ws(' '::text, validador.nombre, validador."apellidoPaterno", validador."apellidoMaterno")) AS nombre_usuario_valida, pc.motivo_rechazo, pc.observaciones AS observaciones_pago, cc.cantidadcupos AS cantidad_cupos, cc.preciounitario AS precio_unitario, cc.subtotal, cc.descuento, cc.total AS total_compra, COALESCE(papc.total_aprobado, 0::numeric) AS total_aprobado_compra, COALESCE(papc.total_en_revision, 0::numeric) AS total_en_revision_compra, GREATEST(cc.total - COALESCE(papc.total_aprobado, 0::numeric), 0::numeric) AS saldo_pendiente, COALESCE(papc.total_intentos_pago, 0::bigint) AS total_intentos_pago, COALESCE(papc.pagos_aprobados, 0::bigint) AS pagos_aprobados_compra, COALESCE(papc.pagos_en_revision, 0::bigint) AS pagos_en_revision_compra, COALESCE(papc.pagos_rechazados, 0::bigint) AS pagos_rechazados_compra, COALESCE(papc.pagos_cancelados, 0::bigint) AS pagos_cancelados_compra, CASE WHEN COALESCE(papc.total_aprobado, 0::numeric) >= cc.total THEN 'Compra pagada'::text WHEN COALESCE(papc.total_aprobado, 0::numeric) > 0::numeric THEN 'Pago parcial'::text WHEN COALESCE(papc.pagos_en_revision, 0::bigint) > 0 THEN 'Pago pendiente de revisión'::text ELSE 'Sin pago aprobado'::text END AS situacion_financiera_compra, CASE WHEN pc.estado::text = 'En revisión'::text AND mp.requiere_comprobante = true AND (pc.ruta_comprobante IS NULL OR length(TRIM(BOTH FROM pc.ruta_comprobante)) = 0) THEN true ELSE false END AS alerta_comprobante_faltante, CASE WHEN pc.estado::text = 'Rechazado'::text AND (pc.motivo_rechazo IS NULL OR length(TRIM(BOTH FROM pc.motivo_rechazo)) = 0) THEN true ELSE false END AS alerta_rechazo_sin_motivo, CASE WHEN (pc.estado::text = ANY (ARRAY['Aprobado'::character varying, 'Rechazado'::character varying]::text[])) AND pc.fecha_validacion IS NULL THEN true ELSE false END AS alerta_validacion_incompleta, cc.fechacompra AS fecha_compra, cc.fechalimitepago AS fecha_limite_pago FROM academia.pagos_cursos pc JOIN academia.comprascursosinacademia cc ON cc.idcompra = pc.id_compra JOIN seguridad.usuarios comprador ON comprador.id = cc.idusuario JOIN academia.cursos c ON c.id_curso = cc.idcurso JOIN academia.estadocomprainacademia ec ON ec.idestadocompra = cc.idestadocompra JOIN academia.metodos_pago_cursos mp ON mp.id_metodo_pago = pc.id_metodo_pago LEFT JOIN seguridad.usuarios validador ON validador.id = pc.usuario_valida LEFT JOIN pagos_aprobados_por_compra papc ON papc.id_compra = pc.id_compra`);

export const vwAgendaSesionesCursosInAcademia = academia.view("vw_agenda_sesiones_cursos", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	idSesion: bigint("id_sesion", { mode: "number" }),
	cursoId: integer("curso_id"),
	tituloCurso: varchar("titulo_curso", { length: 200 }),
	numeroSesion: smallint("numero_sesion"),
	tituloSesion: varchar("titulo_sesion", { length: 150 }),
	descripcionSesion: text("descripcion_sesion"),
	fecha: date(),
	horaInicio: time("hora_inicio"),
	horaFin: time("hora_fin"),
	modalidadId: integer("modalidad_id"),
	modalidad: varchar({ length: 20 }),
	ubicacionId: integer("ubicacion_id"),
	ubicacion: varchar({ length: 150 }),
	enlaceVirtual: text("enlace_virtual"),
	estadoSesion: varchar("estado_sesion", { length: 20 }),
	observaciones: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalInscripcionesCurso: bigint("total_inscripciones_curso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	inscripcionesConParticipante: bigint("inscripciones_con_participante", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	asistenciasGeneradas: bigint("asistencias_generadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	asistenciasCapturadas: bigint("asistencias_capturadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	asistenciasPendientes: bigint("asistencias_pendientes", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	presentes: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ausentes: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	retardos: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	faltasJustificadas: bigint("faltas_justificadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	salidasAnticipadas: bigint("salidas_anticipadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	registrosAsistenciaNoGenerados: bigint("registros_asistencia_no_generados", { mode: "number" }),
	porcentajeCapturaAsistencia: numeric("porcentaje_captura_asistencia"),
	situacionOperativa: text("situacion_operativa"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}).as(sql`WITH inscripciones_por_curso AS ( SELECT ic.curso_id, count(*) AS total_inscripciones, count(*) FILTER (WHERE ic.participante_id IS NOT NULL) AS inscripciones_con_participante FROM academia.inscripciones_cursos ic GROUP BY ic.curso_id ), asistencias_por_sesion AS ( SELECT ac.sesion_id, count(*) AS asistencias_generadas, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Pendiente'::text) AS asistencias_pendientes, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Presente'::text) AS presentes, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Ausente'::text) AS ausentes, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Retardo'::text) AS retardos, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Falta justificada'::text) AS faltas_justificadas, count(*) FILTER (WHERE ac.estado_asistencia::text = 'Salida anticipada'::text) AS salidas_anticipadas, count(*) FILTER (WHERE ac.estado_asistencia::text <> 'Pendiente'::text) AS asistencias_capturadas FROM academia.asistencias_curso ac GROUP BY ac.sesion_id ) SELECT sc.id_sesion, sc.curso_id, c.titulo_curso, sc.numero_sesion, sc.titulo AS titulo_sesion, sc.descripcion AS descripcion_sesion, sc.fecha, sc.hora_inicio, sc.hora_fin, sc.modalidad_id, m.nombre_modalidad AS modalidad, sc.ubicacion_id, uc.nombre_ubicacion AS ubicacion, sc.enlace_virtual, sc.estado AS estado_sesion, sc.observaciones, COALESCE(ipc.total_inscripciones, 0::bigint) AS total_inscripciones_curso, COALESCE(ipc.inscripciones_con_participante, 0::bigint) AS inscripciones_con_participante, COALESCE(aps.asistencias_generadas, 0::bigint) AS asistencias_generadas, COALESCE(aps.asistencias_capturadas, 0::bigint) AS asistencias_capturadas, COALESCE(aps.asistencias_pendientes, 0::bigint) AS asistencias_pendientes, COALESCE(aps.presentes, 0::bigint) AS presentes, COALESCE(aps.ausentes, 0::bigint) AS ausentes, COALESCE(aps.retardos, 0::bigint) AS retardos, COALESCE(aps.faltas_justificadas, 0::bigint) AS faltas_justificadas, COALESCE(aps.salidas_anticipadas, 0::bigint) AS salidas_anticipadas, GREATEST(COALESCE(ipc.total_inscripciones, 0::bigint) - COALESCE(aps.asistencias_generadas, 0::bigint), 0::bigint) AS registros_asistencia_no_generados, CASE WHEN COALESCE(ipc.total_inscripciones, 0::bigint) = 0 THEN 0::numeric ELSE round(COALESCE(aps.asistencias_capturadas, 0::bigint)::numeric / ipc.total_inscripciones::numeric * 100::numeric, 2) END AS porcentaje_captura_asistencia, CASE WHEN sc.estado::text = 'Cancelada'::text THEN 'Sesión cancelada'::text WHEN sc.estado::text = 'Finalizada'::text AND COALESCE(aps.asistencias_pendientes, 0::bigint) = 0 AND COALESCE(aps.asistencias_generadas, 0::bigint) >= COALESCE(ipc.total_inscripciones, 0::bigint) THEN 'Asistencia completa'::text WHEN sc.estado::text = 'Finalizada'::text AND (COALESCE(aps.asistencias_pendientes, 0::bigint) > 0 OR COALESCE(aps.asistencias_generadas, 0::bigint) < COALESCE(ipc.total_inscripciones, 0::bigint)) THEN 'Asistencia incompleta'::text WHEN sc.estado::text = 'En curso'::text THEN 'Sesión en desarrollo'::text WHEN sc.fecha < CURRENT_DATE AND sc.estado::text = 'Programada'::text THEN 'Sesión vencida sin finalizar'::text WHEN sc.fecha = CURRENT_DATE AND sc.estado::text = 'Programada'::text THEN 'Programada para hoy'::text ELSE 'Pendiente'::text END AS situacion_operativa, sc.created_at, sc.updated_at FROM academia.sesiones_curso sc JOIN academia.cursos c ON c.id_curso = sc.curso_id LEFT JOIN academia.modalidades m ON m.id_modalidad = sc.modalidad_id LEFT JOIN academia.ubicaciones_cursos uc ON uc.id_ubicacion = sc.ubicacion_id LEFT JOIN inscripciones_por_curso ipc ON ipc.curso_id = sc.curso_id LEFT JOIN asistencias_por_sesion aps ON aps.sesion_id = sc.id_sesion`);

export const vwAlertasAdministrativasInAcademia = academia.view("vw_alertas_administrativas", {	tipoAlerta: varchar("tipo_alerta", { length: 50 }),
	nivelAlerta: varchar("nivel_alerta", { length: 20 }),
	entidad: varchar({ length: 30 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	entidadId: bigint("entidad_id", { mode: "number" }),
	referencia: varchar({ length: 150 }),
	tituloAlerta: varchar("titulo_alerta", { length: 200 }),
	descripcionAlerta: text("descripcion_alerta"),
	fechaReferencia: timestamp("fecha_referencia", { mode: 'string' }),
	rutaRevision: text("ruta_revision"),
	ordenPrioridad: smallint("orden_prioridad"),
}).as(sql`SELECT 'Compra vencida'::character varying(50) AS tipo_alerta, 'Crítica'::character varying(20) AS nivel_alerta, 'Compra'::character varying(30) AS entidad, rc.id_compra AS entidad_id, rc.folio_compra::character varying(150) AS referencia, 'Compra vencida con saldo pendiente'::character varying(200) AS titulo_alerta, concat('La compra ', rc.folio_compra, ' tiene un saldo pendiente de $', rc.saldo_pendiente, ' y su fecha límite de pago fue ', rc.fecha_limite_pago, '.') AS descripcion_alerta, rc.fecha_limite_pago AS fecha_referencia, concat('/administracion/compras/', rc.id_compra) AS ruta_revision, 1::smallint AS orden_prioridad FROM academia.vw_resumen_compras_cursos rc WHERE rc.saldo_pendiente > 0::numeric AND rc.fecha_limite_pago < CURRENT_TIMESTAMP AND (rc.estado_compra::text <> ALL (ARRAY['Cancelada'::character varying, 'Rechazada'::character varying, 'Expirada'::character varying]::text[])) UNION ALL SELECT 'Pago pendiente'::character varying(50) AS tipo_alerta, 'Advertencia'::character varying(20) AS nivel_alerta, 'Pago'::character varying(30) AS entidad, pc.id_pago AS entidad_id, pc.folio_compra::character varying(150) AS referencia, 'Pago pendiente de revisión'::character varying(200) AS titulo_alerta, concat('Existe un pago de $', pc.monto_pago, ' reportado para la compra ', pc.folio_compra, ' mediante ', pc.metodo_pago, '.') AS descripcion_alerta, pc.fecha_reporte AS fecha_referencia, concat('/administracion/pagos/', pc.id_pago) AS ruta_revision, 2::smallint AS orden_prioridad FROM academia.vw_control_pagos_cursos pc WHERE pc.estado_pago::text = 'En revisión'::text UNION ALL SELECT 'Comprobante faltante'::character varying(50) AS tipo_alerta, 'Crítica'::character varying(20) AS nivel_alerta, 'Pago'::character varying(30) AS entidad, pc.id_pago AS entidad_id, pc.folio_compra::character varying(150) AS referencia, 'Pago sin comprobante requerido'::character varying(200) AS titulo_alerta, concat('El método de pago ', pc.metodo_pago, ' requiere comprobante, pero el pago no tiene un archivo asociado.') AS descripcion_alerta, pc.fecha_reporte AS fecha_referencia, concat('/administracion/pagos/', pc.id_pago) AS ruta_revision, 1::smallint AS orden_prioridad FROM academia.vw_control_pagos_cursos pc WHERE pc.alerta_comprobante_faltante = true UNION ALL SELECT 'Validación incompleta'::character varying(50) AS tipo_alerta, 'Advertencia'::character varying(20) AS nivel_alerta, 'Pago'::character varying(30) AS entidad, pc.id_pago AS entidad_id, pc.folio_compra::character varying(150) AS referencia, 'Pago con validación incompleta'::character varying(200) AS titulo_alerta, concat('El pago aparece como ', pc.estado_pago, ', pero no tiene completa la información de validación.') AS descripcion_alerta, COALESCE(pc.fecha_validacion, pc.fecha_reporte) AS fecha_referencia, concat('/administracion/pagos/', pc.id_pago) AS ruta_revision, 2::smallint AS orden_prioridad FROM academia.vw_control_pagos_cursos pc WHERE pc.alerta_validacion_incompleta = true UNION ALL SELECT 'Inconsistencia de cupos'::character varying(50) AS tipo_alerta, 'Crítica'::character varying(20) AS nivel_alerta, 'Curso'::character varying(30) AS entidad, oc.curso_id::bigint AS entidad_id, oc.titulo_curso::character varying(150) AS referencia, 'Los cupos registrados requieren revisión'::character varying(200) AS titulo_alerta, concat('El curso tiene ', oc.cupos_ocupados, ' cupos ocupados, pero las compras activas representan ', oc.cupos_comprados_activos, ' cupos.') AS descripcion_alerta, NULL::timestamp without time zone AS fecha_referencia, concat('/administracion/cursos/', oc.curso_id, '/ocupacion') AS ruta_revision, 1::smallint AS orden_prioridad FROM academia.vw_ocupacion_cursos oc WHERE oc.cupos_consistentes_con_compras = false UNION ALL SELECT 'Cupo completo'::character varying(50) AS tipo_alerta, 'Informativa'::character varying(20) AS nivel_alerta, 'Curso'::character varying(30) AS entidad, oc.curso_id::bigint AS entidad_id, oc.titulo_curso::character varying(150) AS referencia, 'Curso sin cupos disponibles'::character varying(200) AS titulo_alerta, concat('El curso alcanzó ', oc.cupos_ocupados, ' de ', oc.cupo_maximo, ' cupos.') AS descripcion_alerta, NULL::timestamp without time zone AS fecha_referencia, concat('/administracion/cursos/', oc.curso_id, '/ocupacion') AS ruta_revision, 3::smallint AS orden_prioridad FROM academia.vw_ocupacion_cursos oc WHERE oc.cupo_maximo > 0 AND oc.cupos_disponibles = 0 UNION ALL SELECT 'Asistencia incompleta'::character varying(50) AS tipo_alerta, 'Advertencia'::character varying(20) AS nivel_alerta, 'Sesión'::character varying(30) AS entidad, ag.id_sesion AS entidad_id, concat(ag.titulo_curso, ' - Sesión ', ag.numero_sesion)::character varying(150) AS referencia, 'Captura de asistencia incompleta'::character varying(200) AS titulo_alerta, concat('La sesión tiene ', ag.asistencias_pendientes, ' asistencias pendientes y ', ag.registros_asistencia_no_generados, ' registros que todavía no fueron generados.') AS descripcion_alerta, ag.fecha::timestamp without time zone + ag.hora_inicio::interval AS fecha_referencia, concat('/administracion/sesiones/', ag.id_sesion, '/asistencia') AS ruta_revision, 2::smallint AS orden_prioridad FROM academia.vw_agenda_sesiones_cursos ag WHERE ag.situacion_operativa = 'Asistencia incompleta'::text UNION ALL SELECT 'Sesión vencida'::character varying(50) AS tipo_alerta, 'Advertencia'::character varying(20) AS nivel_alerta, 'Sesión'::character varying(30) AS entidad, ag.id_sesion AS entidad_id, concat(ag.titulo_curso, ' - Sesión ', ag.numero_sesion)::character varying(150) AS referencia, 'Sesión vencida sin finalizar'::character varying(200) AS titulo_alerta, concat('La sesión estaba programada para el ', ag.fecha, ' a las ', ag.hora_inicio, ' y todavía aparece como programada.') AS descripcion_alerta, ag.fecha::timestamp without time zone + ag.hora_inicio::interval AS fecha_referencia, concat('/administracion/sesiones/', ag.id_sesion) AS ruta_revision, 2::smallint AS orden_prioridad FROM academia.vw_agenda_sesiones_cursos ag WHERE ag.situacion_operativa = 'Sesión vencida sin finalizar'::text UNION ALL SELECT 'Ponderación incorrecta'::character varying(50) AS tipo_alerta, 'Advertencia'::character varying(20) AS nivel_alerta, 'Curso'::character varying(30) AS entidad, sa.curso_id::bigint AS entidad_id, sa.titulo_curso::character varying(150) AS referencia, 'Las evaluaciones no suman 100%'::character varying(200) AS titulo_alerta, concat('La ponderación total configurada es de ', sa.ponderacion_total, '%.') AS descripcion_alerta, NULL::timestamp without time zone AS fecha_referencia, concat('/administracion/cursos/', sa.curso_id, '/evaluaciones') AS ruta_revision, 2::smallint AS orden_prioridad FROM academia.vw_seguimiento_academico_cursos sa WHERE sa.total_evaluaciones > 0 AND sa.ponderacion_total <> 100::numeric UNION ALL SELECT 'Certificado pendiente'::character varying(50) AS tipo_alerta, 'Advertencia'::character varying(20) AS nivel_alerta, 'Curso'::character varying(30) AS entidad, sa.curso_id::bigint AS entidad_id, sa.titulo_curso::character varying(150) AS referencia, 'Participantes completados sin certificado'::character varying(200) AS titulo_alerta, concat(sa.completados_sin_certificado, ' participante(s) completaron el curso, pero no tienen certificado emitido.') AS descripcion_alerta, NULL::timestamp without time zone AS fecha_referencia, concat('/administracion/cursos/', sa.curso_id, '/certificados') AS ruta_revision, 2::smallint AS orden_prioridad FROM academia.vw_seguimiento_academico_cursos sa WHERE sa.completados_sin_certificado > 0`);

export const vwIndicadoresGeneralesInAcademia = academia.view("vw_indicadores_generales", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCursos: bigint("total_cursos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cursosActivos: bigint("cursos_activos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cursosInactivos: bigint("cursos_inactivos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cupoMaximoTotal: bigint("cupo_maximo_total", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposOcupadosTotal: bigint("cupos_ocupados_total", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposDisponiblesTotal: bigint("cupos_disponibles_total", { mode: "number" }),
	porcentajeOcupacionGeneral: numeric("porcentaje_ocupacion_general"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCompras: bigint("total_compras", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPendientesPago: bigint("compras_pendientes_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoReportado: bigint("compras_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoValidado: bigint("compras_pago_validado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasConInscripciones: bigint("compras_con_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasCanceladas: bigint("compras_canceladas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasRechazadas: bigint("compras_rechazadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasExpiradas: bigint("compras_expiradas", { mode: "number" }),
	importeTotalCompras: numeric("importe_total_compras"),
	ingresosAprobados: numeric("ingresos_aprobados"),
	saldoPendienteTotal: numeric("saldo_pendiente_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposComprados: bigint("cupos_comprados", { mode: "number" }),
	participantesRegistradosCompras: numeric("participantes_registrados_compras"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPagos: bigint("total_pagos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosAprobados: bigint("pagos_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevision: bigint("pagos_en_revision", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazados: bigint("pagos_rechazados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosCancelados: bigint("pagos_cancelados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosSinComprobante: bigint("pagos_sin_comprobante", { mode: "number" }),
	montoPagosEnRevision: numeric("monto_pagos_en_revision"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalInscripciones: bigint("total_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesNoIniciados: bigint("participantes_no_iniciados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesEnProgreso: bigint("participantes_en_progreso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesCompletados: bigint("participantes_completados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesNoAprobados: bigint("participantes_no_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesAbandonados: bigint("participantes_abandonados", { mode: "number" }),
	promedioAvanceGeneral: numeric("promedio_avance_general"),
	promedioAsistenciaGeneral: numeric("promedio_asistencia_general"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosEmitidos: bigint("certificados_emitidos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosGenerados: bigint("certificados_generados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosRevocados: bigint("certificados_revocados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	completadosSinCertificado: bigint("completados_sin_certificado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalSesiones: bigint("total_sesiones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesProgramadas: bigint("sesiones_programadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesEnCurso: bigint("sesiones_en_curso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesFinalizadas: bigint("sesiones_finalizadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesCanceladas: bigint("sesiones_canceladas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesAsistenciaIncompleta: bigint("sesiones_asistencia_incompleta", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesHoy: bigint("sesiones_hoy", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalAlertas: bigint("total_alertas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	alertasCriticas: bigint("alertas_criticas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	alertasAdvertencia: bigint("alertas_advertencia", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	alertasInformativas: bigint("alertas_informativas", { mode: "number" }),
	fechaConsulta: timestamp("fecha_consulta", { withTimezone: true, mode: 'string' }),
}).as(sql`WITH indicadores_cursos AS ( SELECT count(*) AS total_cursos, count(*) FILTER (WHERE c.activo = true) AS cursos_activos, count(*) FILTER (WHERE c.activo = false) AS cursos_inactivos, COALESCE(sum(c.cupo_maximo), 0::bigint) AS cupo_maximo_total, COALESCE(sum(c.cupos_ocupados), 0::bigint) AS cupos_ocupados_total, COALESCE(sum(GREATEST(c.cupo_maximo - COALESCE(c.cupos_ocupados, 0), 0)), 0::bigint) AS cupos_disponibles_total FROM academia.cursos c ), indicadores_compras AS ( SELECT count(*) AS total_compras, count(*) FILTER (WHERE rc.estado_compra::text = 'Pendiente de pago'::text) AS compras_pendientes_pago, count(*) FILTER (WHERE rc.estado_compra::text = 'Pago reportado'::text) AS compras_pago_reportado, count(*) FILTER (WHERE rc.estado_compra::text = 'Pago validado'::text) AS compras_pago_validado, count(*) FILTER (WHERE rc.estado_compra::text = 'Inscripciones generadas'::text) AS compras_con_inscripciones, count(*) FILTER (WHERE rc.estado_compra::text = 'Cancelada'::text) AS compras_canceladas, count(*) FILTER (WHERE rc.estado_compra::text = 'Rechazada'::text) AS compras_rechazadas, count(*) FILTER (WHERE rc.estado_compra::text = 'Expirada'::text) AS compras_expiradas, COALESCE(sum(rc.total), 0::numeric) AS importe_total_compras, COALESCE(sum(rc.total_pagado), 0::numeric) AS ingresos_aprobados, COALESCE(sum(rc.saldo_pendiente), 0::numeric) AS saldo_pendiente_total, COALESCE(sum(rc.cantidad_cupos), 0::bigint) AS cupos_comprados, COALESCE(sum(rc.participantes_registrados), 0::numeric) AS participantes_registrados_compras FROM academia.vw_resumen_compras_cursos rc ), indicadores_pagos AS ( SELECT count(*) AS total_pagos, count(*) FILTER (WHERE pc.estado_pago::text = 'Aprobado'::text) AS pagos_aprobados, count(*) FILTER (WHERE pc.estado_pago::text = 'En revisión'::text) AS pagos_en_revision, count(*) FILTER (WHERE pc.estado_pago::text = 'Rechazado'::text) AS pagos_rechazados, count(*) FILTER (WHERE pc.estado_pago::text = 'Cancelado'::text) AS pagos_cancelados, count(*) FILTER (WHERE pc.alerta_comprobante_faltante = true) AS pagos_sin_comprobante, COALESCE(sum(pc.monto_pago) FILTER (WHERE pc.estado_pago::text = 'En revisión'::text), 0::numeric) AS monto_pagos_en_revision FROM academia.vw_control_pagos_cursos pc ), indicadores_academicos AS ( SELECT count(*) AS total_inscripciones, count(*) FILTER (WHERE vd.estado_academico::text = 'No iniciado'::text) AS participantes_no_iniciados, count(*) FILTER (WHERE vd.estado_academico::text = 'En progreso'::text) AS participantes_en_progreso, count(*) FILTER (WHERE vd.estado_academico::text = 'Completado'::text) AS participantes_completados, count(*) FILTER (WHERE vd.estado_academico::text = 'No aprobado'::text) AS participantes_no_aprobados, count(*) FILTER (WHERE vd.estado_academico::text = 'Abandonado'::text) AS participantes_abandonados, round(avg(vd.porcentaje_avance), 2) AS promedio_avance_general, round(avg(vd.porcentaje_asistencia), 2) AS promedio_asistencia_general, count(*) FILTER (WHERE vd.estado_certificado::text = 'Emitido'::text) AS certificados_emitidos, count(*) FILTER (WHERE vd.estado_certificado::text = 'Generado'::text) AS certificados_generados, count(*) FILTER (WHERE vd.estado_certificado::text = 'Revocado'::text) AS certificados_revocados, count(*) FILTER (WHERE vd.estado_academico::text = 'Completado'::text AND vd.id_certificado IS NULL) AS completados_sin_certificado FROM academia.vw_detalle_participantes_cursos vd ), indicadores_sesiones AS ( SELECT count(*) AS total_sesiones, count(*) FILTER (WHERE ag.estado_sesion::text = 'Programada'::text) AS sesiones_programadas, count(*) FILTER (WHERE ag.estado_sesion::text = 'En curso'::text) AS sesiones_en_curso, count(*) FILTER (WHERE ag.estado_sesion::text = 'Finalizada'::text) AS sesiones_finalizadas, count(*) FILTER (WHERE ag.estado_sesion::text = 'Cancelada'::text) AS sesiones_canceladas, count(*) FILTER (WHERE ag.situacion_operativa = 'Asistencia incompleta'::text) AS sesiones_asistencia_incompleta, count(*) FILTER (WHERE ag.fecha = CURRENT_DATE) AS sesiones_hoy FROM academia.vw_agenda_sesiones_cursos ag ), indicadores_alertas AS ( SELECT count(*) AS total_alertas, count(*) FILTER (WHERE aa.nivel_alerta::text = 'Crítica'::text) AS alertas_criticas, count(*) FILTER (WHERE aa.nivel_alerta::text = 'Advertencia'::text) AS alertas_advertencia, count(*) FILTER (WHERE aa.nivel_alerta::text = 'Informativa'::text) AS alertas_informativas FROM academia.vw_alertas_administrativas aa ) SELECT ic.total_cursos, ic.cursos_activos, ic.cursos_inactivos, ic.cupo_maximo_total, ic.cupos_ocupados_total, ic.cupos_disponibles_total, CASE WHEN ic.cupo_maximo_total = 0 THEN 0::numeric ELSE round(ic.cupos_ocupados_total::numeric / ic.cupo_maximo_total::numeric * 100::numeric, 2) END AS porcentaje_ocupacion_general, ico.total_compras, ico.compras_pendientes_pago, ico.compras_pago_reportado, ico.compras_pago_validado, ico.compras_con_inscripciones, ico.compras_canceladas, ico.compras_rechazadas, ico.compras_expiradas, ico.importe_total_compras, ico.ingresos_aprobados, ico.saldo_pendiente_total, ico.cupos_comprados, ico.participantes_registrados_compras, ip.total_pagos, ip.pagos_aprobados, ip.pagos_en_revision, ip.pagos_rechazados, ip.pagos_cancelados, ip.pagos_sin_comprobante, ip.monto_pagos_en_revision, ia.total_inscripciones, ia.participantes_no_iniciados, ia.participantes_en_progreso, ia.participantes_completados, ia.participantes_no_aprobados, ia.participantes_abandonados, COALESCE(ia.promedio_avance_general, 0::numeric) AS promedio_avance_general, COALESCE(ia.promedio_asistencia_general, 0::numeric) AS promedio_asistencia_general, ia.certificados_emitidos, ia.certificados_generados, ia.certificados_revocados, ia.completados_sin_certificado, ises.total_sesiones, ises.sesiones_programadas, ises.sesiones_en_curso, ises.sesiones_finalizadas, ises.sesiones_canceladas, ises.sesiones_asistencia_incompleta, ises.sesiones_hoy, ial.total_alertas, ial.alertas_criticas, ial.alertas_advertencia, ial.alertas_informativas, CURRENT_TIMESTAMP AS fecha_consulta FROM indicadores_cursos ic CROSS JOIN indicadores_compras ico CROSS JOIN indicadores_pagos ip CROSS JOIN indicadores_academicos ia CROSS JOIN indicadores_sesiones ises CROSS JOIN indicadores_alertas ial`);

export const vwMetricasMensualesCursosInAcademia = academia.view("vw_metricas_mensuales_cursos", {	anio: integer(),
	mes: integer(),
	periodo: date(),
	periodoClave: text("periodo_clave"),
	nombreMes: text("nombre_mes"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCompras: bigint("total_compras", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	compradoresUnicos: bigint("compradores_unicos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cursosConVentas: bigint("cursos_con_ventas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPendientesPago: bigint("compras_pendientes_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoReportado: bigint("compras_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoValidado: bigint("compras_pago_validado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasConInscripciones: bigint("compras_con_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasCanceladas: bigint("compras_canceladas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasRechazadas: bigint("compras_rechazadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasExpiradas: bigint("compras_expiradas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposComprados: bigint("cupos_comprados", { mode: "number" }),
	participantesRegistrados: numeric("participantes_registrados"),
	subtotalCompras: numeric("subtotal_compras"),
	descuentosAplicados: numeric("descuentos_aplicados"),
	importeTotalCompras: numeric("importe_total_compras"),
	ingresosAprobadosAsociados: numeric("ingresos_aprobados_asociados"),
	saldoPendiente: numeric("saldo_pendiente"),
	ticketPromedio: numeric("ticket_promedio"),
	cuposPromedioPorCompra: numeric("cupos_promedio_por_compra"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPagosReportados: bigint("total_pagos_reportados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasConPagoReportado: bigint("compras_con_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosAprobados: bigint("pagos_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevision: bigint("pagos_en_revision", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazados: bigint("pagos_rechazados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosCancelados: bigint("pagos_cancelados", { mode: "number" }),
	montoTotalReportado: numeric("monto_total_reportado"),
	montoAprobadoEnMes: numeric("monto_aprobado_en_mes"),
	montoEnRevisionEnMes: numeric("monto_en_revision_en_mes"),
	montoRechazadoEnMes: numeric("monto_rechazado_en_mes"),
	montoPromedioPago: numeric("monto_promedio_pago"),
	porcentajeConversionCompra: numeric("porcentaje_conversion_compra"),
	porcentajeCobranzaAsociada: numeric("porcentaje_cobranza_asociada"),
}).as(sql`WITH compras_mensuales AS ( SELECT date_trunc('month'::text, rc.fecha_compra)::date AS periodo, count(*) AS total_compras, count(DISTINCT rc.usuario_comprador_id) AS compradores_unicos, count(DISTINCT rc.curso_id) AS cursos_con_ventas, count(*) FILTER (WHERE rc.estado_compra::text = 'Pendiente de pago'::text) AS compras_pendientes_pago, count(*) FILTER (WHERE rc.estado_compra::text = 'Pago reportado'::text) AS compras_pago_reportado, count(*) FILTER (WHERE rc.estado_compra::text = 'Pago validado'::text) AS compras_pago_validado, count(*) FILTER (WHERE rc.estado_compra::text = 'Inscripciones generadas'::text) AS compras_con_inscripciones, count(*) FILTER (WHERE rc.estado_compra::text = 'Cancelada'::text) AS compras_canceladas, count(*) FILTER (WHERE rc.estado_compra::text = 'Rechazada'::text) AS compras_rechazadas, count(*) FILTER (WHERE rc.estado_compra::text = 'Expirada'::text) AS compras_expiradas, COALESCE(sum(rc.cantidad_cupos), 0::bigint) AS cupos_comprados, COALESCE(sum(rc.participantes_registrados), 0::numeric) AS participantes_registrados, COALESCE(sum(rc.subtotal), 0::numeric) AS subtotal_compras, COALESCE(sum(rc.descuento), 0::numeric) AS descuentos_aplicados, COALESCE(sum(rc.total), 0::numeric) AS importe_total_compras, COALESCE(sum(rc.total_pagado), 0::numeric) AS ingresos_aprobados_asociados, COALESCE(sum(rc.saldo_pendiente), 0::numeric) AS saldo_pendiente, round(avg(rc.total), 2) AS ticket_promedio, round(avg(rc.cantidad_cupos), 2) AS cupos_promedio_por_compra FROM academia.vw_resumen_compras_cursos rc GROUP BY (date_trunc('month'::text, rc.fecha_compra)) ), pagos_mensuales AS ( SELECT date_trunc('month'::text, pc.fecha_reporte)::date AS periodo, count(*) AS total_pagos_reportados, count(DISTINCT pc.id_compra) AS compras_con_pago_reportado, count(*) FILTER (WHERE pc.estado_pago::text = 'Aprobado'::text) AS pagos_aprobados, count(*) FILTER (WHERE pc.estado_pago::text = 'En revisión'::text) AS pagos_en_revision, count(*) FILTER (WHERE pc.estado_pago::text = 'Rechazado'::text) AS pagos_rechazados, count(*) FILTER (WHERE pc.estado_pago::text = 'Cancelado'::text) AS pagos_cancelados, COALESCE(sum(pc.monto_pago), 0::numeric) AS monto_total_reportado, COALESCE(sum(pc.monto_pago) FILTER (WHERE pc.estado_pago::text = 'Aprobado'::text), 0::numeric) AS monto_aprobado_en_mes, COALESCE(sum(pc.monto_pago) FILTER (WHERE pc.estado_pago::text = 'En revisión'::text), 0::numeric) AS monto_en_revision_en_mes, COALESCE(sum(pc.monto_pago) FILTER (WHERE pc.estado_pago::text = 'Rechazado'::text), 0::numeric) AS monto_rechazado_en_mes, round(avg(pc.monto_pago), 2) AS monto_promedio_pago FROM academia.vw_control_pagos_cursos pc GROUP BY (date_trunc('month'::text, pc.fecha_reporte)) ), periodos AS ( SELECT compras_mensuales.periodo FROM compras_mensuales UNION SELECT pagos_mensuales.periodo FROM pagos_mensuales ) SELECT EXTRACT(year FROM p.periodo)::integer AS anio, EXTRACT(month FROM p.periodo)::integer AS mes, p.periodo, to_char(p.periodo::timestamp with time zone, 'YYYY-MM'::text) AS periodo_clave, CASE EXTRACT(month FROM p.periodo)::integer WHEN 1 THEN 'Enero'::text WHEN 2 THEN 'Febrero'::text WHEN 3 THEN 'Marzo'::text WHEN 4 THEN 'Abril'::text WHEN 5 THEN 'Mayo'::text WHEN 6 THEN 'Junio'::text WHEN 7 THEN 'Julio'::text WHEN 8 THEN 'Agosto'::text WHEN 9 THEN 'Septiembre'::text WHEN 10 THEN 'Octubre'::text WHEN 11 THEN 'Noviembre'::text WHEN 12 THEN 'Diciembre'::text ELSE NULL::text END AS nombre_mes, COALESCE(cm.total_compras, 0::bigint) AS total_compras, COALESCE(cm.compradores_unicos, 0::bigint) AS compradores_unicos, COALESCE(cm.cursos_con_ventas, 0::bigint) AS cursos_con_ventas, COALESCE(cm.compras_pendientes_pago, 0::bigint) AS compras_pendientes_pago, COALESCE(cm.compras_pago_reportado, 0::bigint) AS compras_pago_reportado, COALESCE(cm.compras_pago_validado, 0::bigint) AS compras_pago_validado, COALESCE(cm.compras_con_inscripciones, 0::bigint) AS compras_con_inscripciones, COALESCE(cm.compras_canceladas, 0::bigint) AS compras_canceladas, COALESCE(cm.compras_rechazadas, 0::bigint) AS compras_rechazadas, COALESCE(cm.compras_expiradas, 0::bigint) AS compras_expiradas, COALESCE(cm.cupos_comprados, 0::bigint) AS cupos_comprados, COALESCE(cm.participantes_registrados, 0::numeric) AS participantes_registrados, COALESCE(cm.subtotal_compras, 0::numeric) AS subtotal_compras, COALESCE(cm.descuentos_aplicados, 0::numeric) AS descuentos_aplicados, COALESCE(cm.importe_total_compras, 0::numeric) AS importe_total_compras, COALESCE(cm.ingresos_aprobados_asociados, 0::numeric) AS ingresos_aprobados_asociados, COALESCE(cm.saldo_pendiente, 0::numeric) AS saldo_pendiente, COALESCE(cm.ticket_promedio, 0::numeric) AS ticket_promedio, COALESCE(cm.cupos_promedio_por_compra, 0::numeric) AS cupos_promedio_por_compra, COALESCE(pm.total_pagos_reportados, 0::bigint) AS total_pagos_reportados, COALESCE(pm.compras_con_pago_reportado, 0::bigint) AS compras_con_pago_reportado, COALESCE(pm.pagos_aprobados, 0::bigint) AS pagos_aprobados, COALESCE(pm.pagos_en_revision, 0::bigint) AS pagos_en_revision, COALESCE(pm.pagos_rechazados, 0::bigint) AS pagos_rechazados, COALESCE(pm.pagos_cancelados, 0::bigint) AS pagos_cancelados, COALESCE(pm.monto_total_reportado, 0::numeric) AS monto_total_reportado, COALESCE(pm.monto_aprobado_en_mes, 0::numeric) AS monto_aprobado_en_mes, COALESCE(pm.monto_en_revision_en_mes, 0::numeric) AS monto_en_revision_en_mes, COALESCE(pm.monto_rechazado_en_mes, 0::numeric) AS monto_rechazado_en_mes, COALESCE(pm.monto_promedio_pago, 0::numeric) AS monto_promedio_pago, CASE WHEN COALESCE(cm.total_compras, 0::bigint) = 0 THEN 0::numeric ELSE round((COALESCE(cm.compras_pago_validado, 0::bigint) + COALESCE(cm.compras_con_inscripciones, 0::bigint))::numeric / cm.total_compras::numeric * 100::numeric, 2) END AS porcentaje_conversion_compra, CASE WHEN COALESCE(cm.importe_total_compras, 0::numeric) = 0::numeric THEN 0::numeric ELSE round(COALESCE(cm.ingresos_aprobados_asociados, 0::numeric) / cm.importe_total_compras * 100::numeric, 2) END AS porcentaje_cobranza_asociada FROM periodos p LEFT JOIN compras_mensuales cm ON cm.periodo = p.periodo LEFT JOIN pagos_mensuales pm ON pm.periodo = p.periodo`);

export const mvMetricasMensualesCursosInAnalitica = analitica.materializedView("mv_metricas_mensuales_cursos", {	anio: integer(),
	mes: integer(),
	periodo: date(),
	periodoClave: text("periodo_clave"),
	nombreMes: text("nombre_mes"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCompras: bigint("total_compras", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	compradoresUnicos: bigint("compradores_unicos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cursosConVentas: bigint("cursos_con_ventas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPendientesPago: bigint("compras_pendientes_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoReportado: bigint("compras_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoValidado: bigint("compras_pago_validado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasConInscripciones: bigint("compras_con_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasCanceladas: bigint("compras_canceladas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasRechazadas: bigint("compras_rechazadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasExpiradas: bigint("compras_expiradas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposComprados: bigint("cupos_comprados", { mode: "number" }),
	participantesRegistrados: numeric("participantes_registrados"),
	subtotalCompras: numeric("subtotal_compras"),
	descuentosAplicados: numeric("descuentos_aplicados"),
	importeTotalCompras: numeric("importe_total_compras"),
	ingresosAprobadosAsociados: numeric("ingresos_aprobados_asociados"),
	saldoPendiente: numeric("saldo_pendiente"),
	ticketPromedio: numeric("ticket_promedio"),
	cuposPromedioPorCompra: numeric("cupos_promedio_por_compra"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPagosReportados: bigint("total_pagos_reportados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasConPagoReportado: bigint("compras_con_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosAprobados: bigint("pagos_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevision: bigint("pagos_en_revision", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazados: bigint("pagos_rechazados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosCancelados: bigint("pagos_cancelados", { mode: "number" }),
	montoTotalReportado: numeric("monto_total_reportado"),
	montoAprobadoEnMes: numeric("monto_aprobado_en_mes"),
	montoEnRevisionEnMes: numeric("monto_en_revision_en_mes"),
	montoRechazadoEnMes: numeric("monto_rechazado_en_mes"),
	montoPromedioPago: numeric("monto_promedio_pago"),
	porcentajeConversionCompra: numeric("porcentaje_conversion_compra"),
	porcentajeCobranzaAsociada: numeric("porcentaje_cobranza_asociada"),
}).as(sql`SELECT anio, mes, periodo, periodo_clave, nombre_mes, total_compras, compradores_unicos, cursos_con_ventas, compras_pendientes_pago, compras_pago_reportado, compras_pago_validado, compras_con_inscripciones, compras_canceladas, compras_rechazadas, compras_expiradas, cupos_comprados, participantes_registrados, subtotal_compras, descuentos_aplicados, importe_total_compras, ingresos_aprobados_asociados, saldo_pendiente, ticket_promedio, cupos_promedio_por_compra, total_pagos_reportados, compras_con_pago_reportado, pagos_aprobados, pagos_en_revision, pagos_rechazados, pagos_cancelados, monto_total_reportado, monto_aprobado_en_mes, monto_en_revision_en_mes, monto_rechazado_en_mes, monto_promedio_pago, porcentaje_conversion_compra, porcentaje_cobranza_asociada FROM academia.vw_metricas_mensuales_cursos`);

export const mvIndicadoresGeneralesInAnalitica = analitica.materializedView("mv_indicadores_generales", {	idResumen: smallint("id_resumen"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCursos: bigint("total_cursos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cursosActivos: bigint("cursos_activos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cursosInactivos: bigint("cursos_inactivos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cupoMaximoTotal: bigint("cupo_maximo_total", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposOcupadosTotal: bigint("cupos_ocupados_total", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposDisponiblesTotal: bigint("cupos_disponibles_total", { mode: "number" }),
	porcentajeOcupacionGeneral: numeric("porcentaje_ocupacion_general"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCompras: bigint("total_compras", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPendientesPago: bigint("compras_pendientes_pago", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoReportado: bigint("compras_pago_reportado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasPagoValidado: bigint("compras_pago_validado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasConInscripciones: bigint("compras_con_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasCanceladas: bigint("compras_canceladas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasRechazadas: bigint("compras_rechazadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	comprasExpiradas: bigint("compras_expiradas", { mode: "number" }),
	importeTotalCompras: numeric("importe_total_compras"),
	ingresosAprobados: numeric("ingresos_aprobados"),
	saldoPendienteTotal: numeric("saldo_pendiente_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cuposComprados: bigint("cupos_comprados", { mode: "number" }),
	participantesRegistradosCompras: numeric("participantes_registrados_compras"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPagos: bigint("total_pagos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosAprobados: bigint("pagos_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosEnRevision: bigint("pagos_en_revision", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosRechazados: bigint("pagos_rechazados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosCancelados: bigint("pagos_cancelados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	pagosSinComprobante: bigint("pagos_sin_comprobante", { mode: "number" }),
	montoPagosEnRevision: numeric("monto_pagos_en_revision"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalInscripciones: bigint("total_inscripciones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesNoIniciados: bigint("participantes_no_iniciados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesEnProgreso: bigint("participantes_en_progreso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesCompletados: bigint("participantes_completados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesNoAprobados: bigint("participantes_no_aprobados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participantesAbandonados: bigint("participantes_abandonados", { mode: "number" }),
	promedioAvanceGeneral: numeric("promedio_avance_general"),
	promedioAsistenciaGeneral: numeric("promedio_asistencia_general"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosEmitidos: bigint("certificados_emitidos", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosGenerados: bigint("certificados_generados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	certificadosRevocados: bigint("certificados_revocados", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	completadosSinCertificado: bigint("completados_sin_certificado", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalSesiones: bigint("total_sesiones", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesProgramadas: bigint("sesiones_programadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesEnCurso: bigint("sesiones_en_curso", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesFinalizadas: bigint("sesiones_finalizadas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesCanceladas: bigint("sesiones_canceladas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesAsistenciaIncompleta: bigint("sesiones_asistencia_incompleta", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sesionesHoy: bigint("sesiones_hoy", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalAlertas: bigint("total_alertas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	alertasCriticas: bigint("alertas_criticas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	alertasAdvertencia: bigint("alertas_advertencia", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	alertasInformativas: bigint("alertas_informativas", { mode: "number" }),
	fechaConsulta: timestamp("fecha_consulta", { withTimezone: true, mode: 'string' }),
}).as(sql`SELECT 1::smallint AS id_resumen, total_cursos, cursos_activos, cursos_inactivos, cupo_maximo_total, cupos_ocupados_total, cupos_disponibles_total, porcentaje_ocupacion_general, total_compras, compras_pendientes_pago, compras_pago_reportado, compras_pago_validado, compras_con_inscripciones, compras_canceladas, compras_rechazadas, compras_expiradas, importe_total_compras, ingresos_aprobados, saldo_pendiente_total, cupos_comprados, participantes_registrados_compras, total_pagos, pagos_aprobados, pagos_en_revision, pagos_rechazados, pagos_cancelados, pagos_sin_comprobante, monto_pagos_en_revision, total_inscripciones, participantes_no_iniciados, participantes_en_progreso, participantes_completados, participantes_no_aprobados, participantes_abandonados, promedio_avance_general, promedio_asistencia_general, certificados_emitidos, certificados_generados, certificados_revocados, completados_sin_certificado, total_sesiones, sesiones_programadas, sesiones_en_curso, sesiones_finalizadas, sesiones_canceladas, sesiones_asistencia_incompleta, sesiones_hoy, total_alertas, alertas_criticas, alertas_advertencia, alertas_informativas, fecha_consulta FROM academia.vw_indicadores_generales vig`);