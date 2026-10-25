-- SOLO para una base aislada, con revisión y respaldo. Nunca ejecutado por la aplicación.
-- Impide un rollback destructivo si ya hay cuentas anonimizadas (la fecha es la única marca de ello).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'seguridad' AND table_name = 'usuarios' AND column_name = 'fecha_anonimizacion'
  ) THEN
    IF EXISTS (SELECT 1 FROM seguridad.usuarios WHERE fecha_anonimizacion IS NOT NULL) THEN
      RAISE EXCEPTION 'Rollback rechazado: hay cuentas anonimizadas; conservar la columna';
    END IF;
    ALTER TABLE seguridad.usuarios DROP COLUMN fecha_anonimizacion;
  END IF;
END $$;
