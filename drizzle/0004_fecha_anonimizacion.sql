-- Revisar el entorno y el historial antes de ejecutar. Solo agrega una columna nullable (idempotente).
-- No toca filas existentes: todas quedan con fecha_anonimizacion NULL.
ALTER TABLE "seguridad"."usuarios" ADD COLUMN IF NOT EXISTS "fecha_anonimizacion" timestamp;
