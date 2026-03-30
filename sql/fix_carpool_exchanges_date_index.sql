-- Corrige l'index sur carpool_exchanges : la colonne s'appelle original_date, pas date.
-- Idempotent : sûr à relancer (bases déjà initialisées avec l'ancien script).
DO $fix$
BEGIN
  IF to_regclass('public.carpool_exchanges') IS NOT NULL THEN
    DROP INDEX IF EXISTS idx_carpool_exchanges_date;
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_carpool_exchanges_original_date ON carpool_exchanges (original_date)';
  END IF;
END $fix$;
