-- SOLO para una base aislada, con revisión y respaldo. Nunca ejecutado por la aplicación.
-- Impide un rollback destructivo si ya existen preferencias guardadas.
DO $$
BEGIN
  IF to_regclass('seguridad.preferencias_privacidad') IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM seguridad.preferencias_privacidad) THEN
      RAISE EXCEPTION 'Rollback rechazado: hay preferencias de privacidad guardadas; conservar la tabla';
    END IF;
    DROP TABLE seguridad.preferencias_privacidad;
  END IF;
END $$;
