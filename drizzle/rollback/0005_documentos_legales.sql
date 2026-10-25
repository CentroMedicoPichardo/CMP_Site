-- SOLO para una base aislada, con revisión y respaldo. Nunca ejecutado por la aplicación.
-- Impide un rollback destructivo si ya hay aceptaciones registradas (son la evidencia del consentimiento)
-- o si existe una version de documento distinta de la 1.0 sembrada.
DO $$
BEGIN
  IF to_regclass('seguridad.aceptaciones_legales') IS NOT NULL
     AND EXISTS (SELECT 1 FROM seguridad.aceptaciones_legales) THEN
    RAISE EXCEPTION 'Rollback rechazado: hay aceptaciones legales registradas; conservar las tablas';
  END IF;

  IF to_regclass('seguridad.documentos_legales') IS NOT NULL
     AND EXISTS (SELECT 1 FROM seguridad.documentos_legales WHERE version <> '1.0') THEN
    RAISE EXCEPTION 'Rollback rechazado: hay versiones de documentos legales posteriores a la 1.0; conservar las tablas';
  END IF;

  DROP TABLE IF EXISTS seguridad.aceptaciones_legales;
  DROP TABLE IF EXISTS seguridad.documentos_legales;
END $$;
