CREATE SCHEMA "academia";
--> statement-breakpoint
CREATE SCHEMA "auditoria";
--> statement-breakpoint
CREATE SCHEMA "clinica";
--> statement-breakpoint
CREATE SCHEMA "seguridad";
--> statement-breakpoint
CREATE TABLE "academia"."academia_infantil" (
	"id_guia" serial PRIMARY KEY NOT NULL,
	"titulo_guia" varchar(255) NOT NULL,
	"descripcion_corta" text,
	"id_autor" integer,
	"fecha_publicacion" date DEFAULT CURRENT_DATE,
	"url_imagen" text,
	"etiquetas" text,
	"descripcion_larga" text,
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "seguridad"."alertas_seguridad" (
	"id_alerta" serial PRIMARY KEY NOT NULL,
	"tipo_alerta" varchar(50),
	"nivel_critico" varchar(20),
	"mensaje" text,
	"detalle" jsonb,
	"fecha_deteccion" timestamp DEFAULT CURRENT_TIMESTAMP,
	"fecha_resolucion" timestamp,
	"estado" varchar(20) DEFAULT 'PENDIENTE',
	"usuario_asignado" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "seguridad"."auditoria_acciones" (
	"id_auditoria" serial PRIMARY KEY NOT NULL,
	"usuario" varchar(100),
	"ip_address" "inet",
	"accion" varchar(50),
	"tabla_afectada" varchar(100),
	"registro_id" integer,
	"datos_anteriores" jsonb,
	"datos_nuevos" jsonb,
	"fecha_hora" timestamp DEFAULT CURRENT_TIMESTAMP,
	"aplicacion_origen" varchar(100),
	"session_id" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "auditoria"."backups" (
	"id" serial PRIMARY KEY NOT NULL,
	"fecha" timestamp DEFAULT CURRENT_TIMESTAMP,
	"tipo" varchar(20) NOT NULL,
	"tamaño" varchar(20),
	"archivo_url" text,
	"estado" varchar(20) DEFAULT 'exitoso'
);
--> statement-breakpoint
CREATE TABLE "seguridad"."cambios_estructura" (
	"id_cambio" serial PRIMARY KEY NOT NULL,
	"usuario" varchar(100),
	"fecha_cambio" timestamp DEFAULT CURRENT_TIMESTAMP,
	"tipo_objeto" varchar(20),
	"nombre_objeto" varchar(100),
	"sentencia_ddl" text,
	"cambio_detalle" jsonb
);
--> statement-breakpoint
CREATE TABLE "academia"."categorias_cursos" (
	"id_categoria" serial PRIMARY KEY NOT NULL,
	"nombre_categoria" varchar(50) NOT NULL,
	"descripcion" text,
	"activo" boolean DEFAULT true,
	CONSTRAINT "categorias_cursos_nombre_categoria_key" UNIQUE("nombre_categoria")
);
--> statement-breakpoint
CREATE TABLE "academia"."contenido_saber_pediatrico" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" varchar(20) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"descripcion" text,
	"contenido" text,
	"url_externo" text,
	"imagen_url" text,
	"video_url" text,
	"archivo_url" text,
	"categoria" varchar(50),
	"etiquetas" text[],
	"duracion" varchar(20),
	"fecha_publicacion" date DEFAULT CURRENT_DATE,
	"destacado" boolean DEFAULT false,
	"orden" integer DEFAULT 0,
	"activo" boolean DEFAULT true,
	"visualizaciones" integer DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "academia"."cursos" (
	"id_curso" serial PRIMARY KEY NOT NULL,
	"titulo_curso" varchar(200) NOT NULL,
	"descripcion" text,
	"id_instructor" integer NOT NULL,
	"id_categoria" integer NOT NULL,
	"id_ubicacion" integer,
	"id_modalidad" integer NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"horario" varchar(50),
	"dirigido_a" varchar(50),
	"cupo_maximo" integer NOT NULL,
	"costo" numeric(10, 2) DEFAULT '0.00',
	"url_imagen_portada" text,
	"activo" boolean DEFAULT true,
	"cupos_ocupados" integer DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "cursos_cupo_maximo_check" CHECK (cupo_maximo > 0),
	CONSTRAINT "cursos_costo_check" CHECK (costo >= (0)::numeric),
	CONSTRAINT "cursos_cupos_ocupados_check" CHECK (cupos_ocupados >= 0),
	CONSTRAINT "check_fechas" CHECK (fecha_fin >= fecha_inicio),
	CONSTRAINT "check_cupos" CHECK (cupos_ocupados <= cupo_maximo)
);
--> statement-breakpoint
CREATE TABLE "clinica"."empresa_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"direccion" text NOT NULL,
	"telefono" varchar(20) NOT NULL,
	"correo" varchar(150) NOT NULL,
	"facebook" varchar(150),
	"instagram" varchar(150),
	"horario" text NOT NULL,
	"logo_url" text,
	"correo_soporte" varchar(150),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "academia"."encuestas" (
	"id" serial PRIMARY KEY NOT NULL,
	"contenido_id" integer,
	"preguntas" jsonb,
	"fecha_inicio" date,
	"fecha_fin" date,
	"total_participantes" integer DEFAULT 0,
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "seguridad"."estadisticas_consumo" (
	"id_estadistica" serial PRIMARY KEY NOT NULL,
	"fecha" date DEFAULT CURRENT_DATE,
	"hora" integer,
	"total_consultas" integer,
	"consultas_lentas" integer,
	"errores_sql" integer,
	"usuarios_activos" integer,
	"ancho_banda_mb" numeric(10, 2),
	"operaciones_crud" jsonb
);
--> statement-breakpoint
CREATE TABLE "academia"."inscripciones_cursos" (
	"id_inscripcion" serial PRIMARY KEY NOT NULL,
	"curso_id" integer NOT NULL,
	"usuario_id" integer NOT NULL,
	"fecha_inscripcion" timestamp DEFAULT CURRENT_TIMESTAMP,
	"estado" varchar(20) DEFAULT 'activo',
	"monto_pagado" numeric(10, 2),
	"metodo_pago" varchar(50),
	CONSTRAINT "unique_inscripcion_curso_usuario" UNIQUE("curso_id","usuario_id")
);
--> statement-breakpoint
CREATE TABLE "academia"."instructores" (
	"id_instructor" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido_paterno" varchar(100) NOT NULL,
	"apellido_materno" varchar(100),
	"especialidad" varchar(100) NOT NULL,
	"edad" integer NOT NULL,
	"telefono" varchar(20),
	"correo" varchar(150) NOT NULL,
	"direccion" text,
	"activo" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "instructores_correo_key" UNIQUE("correo")
);
--> statement-breakpoint
CREATE TABLE "auditoria"."intentos_recuperacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"identificador" text NOT NULL,
	"conteo" integer DEFAULT 0,
	"ultimo_intento" timestamp DEFAULT now(),
	"bloqueado_hasta" timestamp
);
--> statement-breakpoint
CREATE TABLE "clinica"."medicos" (
	"id_medico" serial PRIMARY KEY NOT NULL,
	"nombres" varchar(100) NOT NULL,
	"apellido_paterno" varchar(100) NOT NULL,
	"apellido_materno" varchar(100),
	"especialidad" varchar(100),
	"hospital_clinica" varchar(150),
	"direccion" text,
	"url_foto" varchar(255),
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "academia"."modalidades" (
	"id_modalidad" serial PRIMARY KEY NOT NULL,
	"nombre_modalidad" varchar(20) NOT NULL,
	"descripcion" text,
	CONSTRAINT "modalidades_nombre_modalidad_key" UNIQUE("nombre_modalidad")
);
--> statement-breakpoint
CREATE TABLE "seguridad"."monitoreo_rendimiento" (
	"id_monitoreo" serial PRIMARY KEY NOT NULL,
	"fecha_hora" timestamp DEFAULT CURRENT_TIMESTAMP,
	"query_text" text,
	"tiempo_ejecucion_ms" integer,
	"cpu_usage_percent" numeric(5, 2),
	"memoria_usage_mb" integer,
	"conexiones_activas" integer,
	"deadlocks_detectados" integer,
	"cache_hit_ratio" numeric(5, 2),
	"tabla_consultada" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "clinica"."nosotros" (
	"id" serial PRIMARY KEY NOT NULL,
	"mision" text NOT NULL,
	"vision" text NOT NULL,
	"valores" text[] NOT NULL,
	"nuestra_historia" text NOT NULL,
	"compromiso" text NOT NULL,
	"url_imagen" text DEFAULT '/pediatric-illustration.png'
);
--> statement-breakpoint
CREATE TABLE "academia"."publicaciones" (
	"id_publicacion" serial PRIMARY KEY NOT NULL,
	"titulo_noticia" varchar(255) NOT NULL,
	"resumen_bajada" text,
	"id_autor" integer,
	"fecha_publicacion" date DEFAULT CURRENT_DATE,
	"etiquetas" text,
	"url_imagen" text,
	"contenido_completo" text,
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "academia"."respuestas_encuestas" (
	"id" serial PRIMARY KEY NOT NULL,
	"encuesta_id" integer,
	"usuario_id" integer,
	"respuestas" jsonb,
	"fecha_respuesta" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "seguridad"."roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	CONSTRAINT "roles_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "clinica"."servicios" (
	"id_servicio" serial PRIMARY KEY NOT NULL,
	"titulo_servicio" varchar(150) NOT NULL,
	"descripcion" text,
	"ubicacion" varchar(200),
	"url_image" text,
	"texto_alt" varchar(150),
	"diseno_tipo" varchar(20) DEFAULT 'vertical',
	"activo" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "academia"."ubicaciones_cursos" (
	"id_ubicacion" serial PRIMARY KEY NOT NULL,
	"nombre_ubicacion" varchar(150) NOT NULL,
	"direccion_completa" text,
	"capacidad_maxima" integer,
	"activo" boolean DEFAULT true,
	CONSTRAINT "ubicaciones_cursos_nombre_ubicacion_key" UNIQUE("nombre_ubicacion")
);
--> statement-breakpoint
CREATE TABLE "seguridad"."usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"apellidoPaterno" text NOT NULL,
	"apellidoMaterno" text,
	"edad" integer NOT NULL,
	"sexo" text NOT NULL,
	"telefono" text NOT NULL,
	"correo" text NOT NULL,
	"contrasena" text NOT NULL,
	"rol_id" integer NOT NULL,
	"reset_token" text,
	"reset_token_expiry" timestamp,
	"intentos_fallidos" integer DEFAULT 0,
	"bloqueado_hasta" timestamp,
	"version_token" integer DEFAULT 1,
	"mfa_habilitado" boolean DEFAULT false,
	"secreto_mfa" text,
	"activo" boolean DEFAULT true,
	CONSTRAINT "usuarios_correo_unique" UNIQUE("correo")
);
--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
DROP TABLE "intentos_recuperacion" CASCADE;--> statement-breakpoint
DROP TABLE "cursos" CASCADE;--> statement-breakpoint
DROP TABLE "academia_infantil" CASCADE;--> statement-breakpoint
DROP TABLE "backups" CASCADE;--> statement-breakpoint
DROP TABLE "nosotros" CASCADE;--> statement-breakpoint
DROP TABLE "publicaciones" CASCADE;--> statement-breakpoint
DROP TABLE "usuarios" CASCADE;--> statement-breakpoint
DROP TABLE "servicios" CASCADE;--> statement-breakpoint
DROP TABLE "medicos" CASCADE;--> statement-breakpoint
ALTER TABLE "academia"."academia_infantil" ADD CONSTRAINT "academia_infantil_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "clinica"."medicos"("id_medico") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."cursos" ADD CONSTRAINT "fk_cursos_instructor" FOREIGN KEY ("id_instructor") REFERENCES "academia"."instructores"("id_instructor") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."cursos" ADD CONSTRAINT "fk_cursos_categoria" FOREIGN KEY ("id_categoria") REFERENCES "academia"."categorias_cursos"("id_categoria") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."cursos" ADD CONSTRAINT "fk_cursos_ubicacion" FOREIGN KEY ("id_ubicacion") REFERENCES "academia"."ubicaciones_cursos"("id_ubicacion") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."cursos" ADD CONSTRAINT "fk_cursos_modalidad" FOREIGN KEY ("id_modalidad") REFERENCES "academia"."modalidades"("id_modalidad") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."encuestas" ADD CONSTRAINT "encuestas_contenido_id_fkey" FOREIGN KEY ("contenido_id") REFERENCES "academia"."contenido_saber_pediatrico"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."inscripciones_cursos" ADD CONSTRAINT "fk_inscripcion_curso" FOREIGN KEY ("curso_id") REFERENCES "academia"."cursos"("id_curso") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."inscripciones_cursos" ADD CONSTRAINT "fk_inscripcion_usuario" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."publicaciones" ADD CONSTRAINT "publicaciones_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "clinica"."medicos"("id_medico") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."respuestas_encuestas" ADD CONSTRAINT "respuestas_encuestas_encuesta_id_fkey" FOREIGN KEY ("encuesta_id") REFERENCES "academia"."encuestas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia"."respuestas_encuestas" ADD CONSTRAINT "respuestas_encuestas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seguridad"."usuarios" ADD CONSTRAINT "usuarios_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "seguridad"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_backups_fecha" ON "auditoria"."backups" USING btree ("fecha" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_backups_tipo" ON "auditoria"."backups" USING btree ("tipo" text_ops);--> statement-breakpoint
CREATE INDEX "idx_cursos_activo" ON "academia"."cursos" USING btree ("activo" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_cursos_categoria" ON "academia"."cursos" USING btree ("id_categoria" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_cursos_dirigido_a" ON "academia"."cursos" USING btree ("dirigido_a" text_ops);--> statement-breakpoint
CREATE INDEX "idx_cursos_fechas" ON "academia"."cursos" USING btree ("fecha_inicio" date_ops,"fecha_fin" date_ops);--> statement-breakpoint
CREATE INDEX "idx_cursos_instructor" ON "academia"."cursos" USING btree ("id_instructor" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_cursos_modalidad" ON "academia"."cursos" USING btree ("id_modalidad" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_inscripciones_curso" ON "academia"."inscripciones_cursos" USING btree ("curso_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_inscripciones_estado" ON "academia"."inscripciones_cursos" USING btree ("estado" text_ops);--> statement-breakpoint
CREATE INDEX "idx_inscripciones_fecha" ON "academia"."inscripciones_cursos" USING btree ("fecha_inscripcion" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_inscripciones_usuario" ON "academia"."inscripciones_cursos" USING btree ("usuario_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_instructores_activo" ON "academia"."instructores" USING btree ("activo" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_instructores_especialidad" ON "academia"."instructores" USING btree ("especialidad" text_ops);