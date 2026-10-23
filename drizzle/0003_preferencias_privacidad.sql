-- Revisar el entorno y el historial antes de ejecutar. Solo crea seguridad.preferencias_privacidad (idempotente).
-- drizzle-kit generate produce el diff completo contra el snapshot 0002 (que no incluye analitica ni soporte);
-- se recorta a la unica tabla nueva, igual que 0002_materiales_drive.sql.
CREATE TABLE IF NOT EXISTS "seguridad"."preferencias_privacidad" (
	"usuario_id" integer PRIMARY KEY NOT NULL,
	"comunicaciones_no_esenciales" boolean DEFAULT false NOT NULL,
	"analitica" boolean DEFAULT false NOT NULL,
	"compartir_progreso" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "preferencias_privacidad_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE cascade ON UPDATE no action
);
