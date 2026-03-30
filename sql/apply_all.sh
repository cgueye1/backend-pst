#!/usr/bin/env bash
# Applique le schéma principal puis les migrations SQL du projet.
#
# Usage:
#   export DATABASE_URL='postgresql://user:pass@host:5432/nom_base'
#   chmod +x sql/apply_all.sh
#   ./sql/apply_all.sh
#
# Exclut volontairement:
#   - systemeSMS.sql (tables messagerie déjà dans schema.sql — doublons)
#   - carpool_table.sql (dump pg_dump / données de test)
#   - tests/*.sql, test-notifications.sql, verifier_comptes_tables.sql (tests / vérifs)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${DATABASE_URL:?Définissez DATABASE_URL (ex: postgresql://user:pass@host:5432/db)}"

run() {
  echo ">>> $1"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/$1"
}

run "schema.sql"

MIGRATIONS=(
  "create_carpool_tables.sql"
  "fix_driver_nullable.sql"
  "migration_make_driver_documents_nullable.sql"
  "add_gps_columns_to_trips.sql"
  "add_arrival_time_to_trips.sql"
  "add_schedule_to_children.sql"
  "migration_create_trip_locations.sql"
  "migration_add_trip_stops.sql"
  "migration_add_trip_overall_status.sql"
  "migration_add_return_status.sql"
  "migration_add_return_trips.sql"
  "update_capacity_limit.sql"
  "update_carpool_planning.sql"
  "update_existing_trips_gps.sql"
  "fix_confirmation_status_length.sql"
  "fix_carpool_exchanges_date_index.sql"
)

for f in "${MIGRATIONS[@]}"; do
  run "$f"
done

echo "Terminé. Optionnel: exécuter verifier_comptes_tables.sql pour un rapport de lignes par table."
