import { pgTable, pgSchema, serial, date, integer, numeric, jsonb, foreignKey, varchar, text, boolean, unique, timestamp, index, inet, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const clinica = pgSchema("clinica");
export const seguridad = pgSchema("seguridad");
export const academia = pgSchema("academia");
export const auditoria = pgSchema("auditoria");


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

export const rolesInSeguridad = seguridad.table("roles", {
	id: serial().primaryKey().notNull(),
	nombre: text().notNull(),
}, (table) => [
	unique("roles_nombre_unique").on(table.nombre),
]);

export const backupsInAuditoria = auditoria.table("backups", {
	id: serial().primaryKey().notNull(),
	fecha: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	tipo: varchar({ length: 20 }).notNull(),
	"tamaño": varchar("tamaño", { length: 20 }),
	archivoUrl: text("archivo_url"),
	estado: varchar({ length: 20 }).default('exitoso'),
}, (table) => [
	index("idx_backups_fecha").using("btree", table.fecha.desc().nullsFirst().op("timestamp_ops")),
	index("idx_backups_tipo").using("btree", table.tipo.asc().nullsLast().op("text_ops")),
]);

export const intentosRecuperacionInAuditoria = auditoria.table("intentos_recuperacion", {
	id: serial().primaryKey().notNull(),
	identificador: text().notNull(),
	conteo: integer().default(0),
	ultimoIntento: timestamp("ultimo_intento", { mode: 'string' }).defaultNow(),
	bloqueadoHasta: timestamp("bloqueado_hasta", { mode: 'string' }),
});

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
			columns: [table.idInstructor],
			foreignColumns: [instructoresInAcademia.idInstructor],
			name: "fk_cursos_instructor"
		}),
	foreignKey({
			columns: [table.idCategoria],
			foreignColumns: [categoriasCursosInAcademia.idCategoria],
			name: "fk_cursos_categoria"
		}),
	foreignKey({
			columns: [table.idUbicacion],
			foreignColumns: [ubicacionesCursosInAcademia.idUbicacion],
			name: "fk_cursos_ubicacion"
		}),
	foreignKey({
			columns: [table.idModalidad],
			foreignColumns: [modalidadesInAcademia.idModalidad],
			name: "fk_cursos_modalidad"
		}),
	check("cursos_cupo_maximo_check", sql`cupo_maximo > 0`),
	check("cursos_costo_check", sql`costo >= (0)::numeric`),
	check("cursos_cupos_ocupados_check", sql`cupos_ocupados >= 0`),
	check("check_fechas", sql`fecha_fin >= fecha_inicio`),
	check("check_cupos", sql`cupos_ocupados <= cupo_maximo`),
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

export const inscripcionesCursosInAcademia = academia.table("inscripciones_cursos", {
	idInscripcion: serial("id_inscripcion").primaryKey().notNull(),
	cursoId: integer("curso_id").notNull(),
	usuarioId: integer("usuario_id").notNull(),
	fechaInscripcion: timestamp("fecha_inscripcion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	estado: varchar({ length: 20 }).default('activo'),
	montoPagado: numeric("monto_pagado", { precision: 10, scale:  2 }),
	metodoPago: varchar("metodo_pago", { length: 50 }),
}, (table) => [
	index("idx_inscripciones_curso").using("btree", table.cursoId.asc().nullsLast().op("int4_ops")),
	index("idx_inscripciones_estado").using("btree", table.estado.asc().nullsLast().op("text_ops")),
	index("idx_inscripciones_fecha").using("btree", table.fechaInscripcion.desc().nullsFirst().op("timestamp_ops")),
	index("idx_inscripciones_usuario").using("btree", table.usuarioId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.cursoId],
			foreignColumns: [cursosInAcademia.idCurso],
			name: "fk_inscripcion_curso"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuariosInSeguridad.id],
			name: "fk_inscripcion_usuario"
		}).onDelete("cascade"),
	unique("unique_inscripcion_curso_usuario").on(table.cursoId, table.usuarioId),
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
