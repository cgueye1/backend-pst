#!/bin/sh
# Démarre l'app après init SQL optionnelle (une fois, si la table users n'existe pas).
# Nécessite postgresql-client (psql) dans l'image + DATABASE_URL au runtime.
#
# SKIP_DB_INIT=1  → ne pas exécuter les .sql (vous gérez la base à la main)
# DB_INIT_WAIT_SECONDS=60  → temps max d'attente Postgres (défaut 60)

set -e

SQL_DIR="/app/sql"
WAIT_TOTAL="${DB_INIT_WAIT_SECONDS:-60}"
SLEEP=2

run_sql() {
  _file="$1"
  echo ">>> sql/$_file"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SQL_DIR/$_file"
}

if [ -n "$SKIP_DB_INIT" ] && [ "$SKIP_DB_INIT" != "0" ] && [ "$SKIP_DB_INIT" != "false" ]; then
  echo "SKIP_DB_INIT défini — pas d'exécution des scripts SQL."
  exec node server.js
fi

if [ -z "$DATABASE_URL" ]; then
  echo "WARN: DATABASE_URL vide — impossible d'initialiser la base, démarrage du serveur quand même."
  exec node server.js
fi

echo "Attente de PostgreSQL (max ${WAIT_TOTAL}s)..."
_elapsed=0
while [ "$_elapsed" -lt "$WAIT_TOTAL" ]; do
  if psql "$DATABASE_URL" -tAc "SELECT 1" >/dev/null 2>&1; then
    echo "PostgreSQL joignable."
    break
  fi
  sleep "$SLEEP"
  _elapsed=$((_elapsed + SLEEP))
done

if ! psql "$DATABASE_URL" -tAc "SELECT 1" >/dev/null 2>&1; then
  echo "ERREUR: PostgreSQL injoignable après ${WAIT_TOTAL}s. Vérifiez DATABASE_URL et le réseau."
  exit 1
fi

if psql "$DATABASE_URL" -tAc "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'" 2>/dev/null | grep -q 1; then
  echo "Table public.users déjà présente — pas de ré-exécution des .sql."
else
  echo "Base vide (pas de table users) — application de schema.sql et des migrations..."
  run_sql schema.sql
  run_sql create_carpool_tables.sql
  run_sql fix_driver_nullable.sql
  run_sql migration_make_driver_documents_nullable.sql
  run_sql add_gps_columns_to_trips.sql
  run_sql add_arrival_time_to_trips.sql
  run_sql add_schedule_to_children.sql
  run_sql migration_create_trip_locations.sql
  run_sql migration_add_trip_stops.sql
  run_sql migration_add_trip_overall_status.sql
  run_sql migration_add_return_status.sql
  run_sql migration_add_return_trips.sql
  run_sql update_capacity_limit.sql
  run_sql update_carpool_planning.sql
  run_sql update_existing_trips_gps.sql
  run_sql fix_confirmation_status_length.sql
  echo "Init SQL terminée."
fi

# Toujours exécuter les correctifs idempotents (ex. index covoiturage si ancienne image SQL)
if [ -f "$SQL_DIR/fix_carpool_exchanges_date_index.sql" ]; then
  echo ">>> sql/fix_carpool_exchanges_date_index.sql (idempotent)"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SQL_DIR/fix_carpool_exchanges_date_index.sql"
fi

exec node server.js
