-- Script pour vérifier le nombre de lignes dans chaque table
DO $$
DECLARE
    r RECORD;
    count_result INTEGER;
BEGIN
    RAISE NOTICE '=== Comptage des lignes par table ===';
    RAISE NOTICE '';
    
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', r.table_name) INTO count_result;
        RAISE NOTICE 'Table: % | Lignes: %', r.table_name, count_result;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== Fin du rapport ===';
END $$;

-- Afficher aussi un résumé sous forme de tableau
SELECT 
    table_name,
    (xpath('/row/c/text()', 
        query_to_xml(
            format('SELECT COUNT(*) as c FROM %I.%I', table_schema, table_name), 
            false, true, ''
        )
    ))[1]::text::int AS row_count
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

