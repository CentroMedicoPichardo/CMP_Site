-- SOLO para una base aislada, con revisión y respaldo. Nunca ejecutado por la aplicación.
-- Impide un rollback destructivo si ya se configuró algún enlace.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'academia' AND table_name = 'cursos' AND column_name = 'url_materiales_drive'
  ) THEN
    IF EXISTS (SELECT 1 FROM academia.cursos WHERE url_materiales_drive IS NOT NULL) THEN
      RAISE EXCEPTION 'Rollback rechazado: hay materiales configurados; conservar la columna';
    END IF;
    ALTER TABLE academia.cursos DROP COLUMN url_materiales_drive;
  END IF;
END $$;
