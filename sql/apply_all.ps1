# Applique schema.sql puis les migrations (meme ordre que apply_all.sh).
#
# Usage (PowerShell), depuis la racine du backend ou ailleurs:
#   $env:DATABASE_URL = "postgresql://user:pass@host:5432/nom_base"
#   .\sql\apply_all.ps1
#
# Requiert: psql dans le PATH (client PostgreSQL).

$ErrorActionPreference = "Stop"

if (-not $env:DATABASE_URL) {
    Write-Error "Definissez DATABASE_URL (ex: postgresql://user:pass@host:5432/db)"
}

$ScriptDir = $PSScriptRoot

function Invoke-SqlFile {
    param([string]$RelativePath)
    $full = Join-Path $ScriptDir $RelativePath
    if (-not (Test-Path $full)) {
        Write-Error "Fichier introuvable: $full"
    }
    Write-Host ">>> $RelativePath" -ForegroundColor Cyan
    & psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f $full
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Echec: $RelativePath (code $LASTEXITCODE)"
    }
}

Invoke-SqlFile "schema.sql"

$migrations = @(
    "create_carpool_tables.sql",
    "fix_driver_nullable.sql",
    "migration_make_driver_documents_nullable.sql",
    "add_gps_columns_to_trips.sql",
    "add_arrival_time_to_trips.sql",
    "add_schedule_to_children.sql",
    "migration_create_trip_locations.sql",
    "migration_add_trip_stops.sql",
    "migration_add_trip_overall_status.sql",
    "migration_add_return_status.sql",
    "migration_add_return_trips.sql",
    "update_capacity_limit.sql",
    "update_carpool_planning.sql",
    "update_existing_trips_gps.sql",
    "fix_confirmation_status_length.sql",
    "fix_carpool_exchanges_date_index.sql"
)

foreach ($f in $migrations) {
    Invoke-SqlFile $f
}

Write-Host "Termine. Optionnel: verifier_comptes_tables.sql pour un rapport." -ForegroundColor Green
