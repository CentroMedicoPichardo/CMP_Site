-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	CONSTRAINT "roles_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "intentos_recuperacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"identificador" text NOT NULL,
	"conteo" integer DEFAULT 0,
	"ultimo_intento" timestamp DEFAULT now(),
	"bloqueado_hasta" timestamp
);
--> statement-breakpoint
CREATE TABLE "cursos" (
	"id_curso" serial PRIMARY KEY NOT NULL,
	"titulo_curso" varchar(200) NOT NULL,
	"descripcion" text,
	"id_instructor" integer,
	"categoria" varchar(50),
	"fecha_inicio" date,
	"fecha_fin" date,
	"horario" varchar(50),
	"modalidad" varchar(20),
	"dirigido_a" varchar(50),
	"cupo_maximo" integer,
	"ubicacion" varchar(150),
	"costo" numeric(10, 2) DEFAULT '0.00',
	"url_imagen_portada" text,
	"activo" boolean DEFAULT true,
	"cupos_ocupados" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "academia_infantil" (
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
CREATE TABLE "backups" (
	"id" serial PRIMARY KEY NOT NULL,
	"fecha" timestamp DEFAULT CURRENT_TIMESTAMP,
	"tipo" varchar(20) NOT NULL,
	"tamaño" varchar(20),
	"archivo_url" text,
	"estado" varchar(20) DEFAULT 'exitoso'
);
--> statement-breakpoint
CREATE TABLE "nosotros" (
	"id" serial PRIMARY KEY NOT NULL,
	"mision" text NOT NULL,
	"vision" text NOT NULL,
	"valores" text[] NOT NULL,
	"nuestra_historia" text NOT NULL,
	"compromiso" text NOT NULL,
	"url_imagen" text DEFAULT '/pediatric-illustration.png'
);
--> statement-breakpoint
CREATE TABLE "publicaciones" (
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
CREATE TABLE "usuarios" (
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
CREATE TABLE "servicios" (
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
CREATE TABLE "medicos" (
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
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_id_instructor_fkey" FOREIGN KEY ("id_instructor") REFERENCES "public"."medicos"("id_medico") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academia_infantil" ADD CONSTRAINT "academia_infantil_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "public"."medicos"("id_medico") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "public"."medicos"("id_medico") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
*/