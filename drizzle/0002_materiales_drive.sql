-- Revisar el entorno y el historial antes de ejecutar. Producción ya tiene la columna.
ALTER TABLE "academia"."cursos" ADD COLUMN IF NOT EXISTS "url_materiales_drive" text;
