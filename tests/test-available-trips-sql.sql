-- Script SQL pour diagnostiquer le problème avec les trajets disponibles
-- Ce script vérifie directement dans la base de données

-- 1. Trouver un parent et ses enfants
SELECT 
    u.id as parent_id,
    u.email,
    u.name as parent_name,
    u.address as parent_address,
    c.id as child_id,
    c.name as child_name,
    c.school_id,
    c.schedule,
    c.address as child_address,
    s.name as school_name
FROM users u
LEFT JOIN children c ON c.parent_id = u.id
LEFT JOIN schools s ON s.id = c.school_id
WHERE u.role = 'parent'
ORDER BY u.id, c.id
LIMIT 10;

-- 2. Vérifier les trajets disponibles pour un parent spécifique
-- Remplacez PARENT_ID par l'ID d'un parent réel
WITH parent_children AS (
    SELECT 
        c.id as child_id,
        c.school_id,
        c.schedule,
        COALESCE(c.address, u.address) as address
    FROM children c
    INNER JOIN users u ON c.parent_id = u.id
    WHERE c.parent_id = 1  -- REMPLACEZ PAR L'ID DU PARENT
    AND c.school_id IS NOT NULL
),
parent_schools AS (
    SELECT DISTINCT school_id 
    FROM parent_children
)
SELECT 
    t.id,
    t.driver_id,
    t.school_id,
    t.start_point,
    t.end_point,
    t.departure_time,
    t.trip_type,
    t.status,
    t.capacity_max,
    t.start_latitude,
    t.start_longitude,
    s.name as school_name,
    (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) as booked_seats,
    (t.capacity_max - COALESCE((SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id), 0)) as available_seats,
    CASE 
        WHEN t.departure_time > NOW() THEN 'Futur'
        ELSE 'Passé'
    END as time_status
FROM trips t
INNER JOIN parent_schools ps ON t.school_id = ps.school_id
LEFT JOIN schools s ON t.school_id = s.id
WHERE t.driver_id IS NOT NULL
AND t.status = 'pending'
AND t.departure_time > NOW()
ORDER BY t.departure_time ASC;

-- 3. Vérifier les emplois du temps des enfants
SELECT 
    c.id as child_id,
    c.name,
    c.school_id,
    c.schedule,
    jsonb_array_elements(c.schedule) as day_schedule
FROM children c
WHERE c.parent_id = 1  -- REMPLACEZ PAR L'ID DU PARENT
AND c.school_id IS NOT NULL;

-- 4. Vérifier si un trajet spécifique correspond aux critères
-- Remplacez TRIP_ID par l'ID d'un trajet réel
SELECT 
    t.id as trip_id,
    t.departure_time,
    t.trip_type,
    TO_CHAR(t.departure_time, 'Day') as day_name,
    EXTRACT(DOW FROM t.departure_time) as day_of_week,  -- 0 = Dimanche, 1 = Lundi, etc.
    CASE 
        WHEN EXTRACT(DOW FROM t.departure_time) = 0 THEN 7  -- Dimanche -> 7
        ELSE EXTRACT(DOW FROM t.departure_time)::int  -- Lundi -> 1, etc.
    END as pg_day_of_week,
    CASE 
        WHEN EXTRACT(DOW FROM t.departure_time) = 0 THEN 'Dimanche'
        WHEN EXTRACT(DOW FROM t.departure_time) = 1 THEN 'Lundi'
        WHEN EXTRACT(DOW FROM t.departure_time) = 2 THEN 'Mardi'
        WHEN EXTRACT(DOW FROM t.departure_time) = 3 THEN 'Mercredi'
        WHEN EXTRACT(DOW FROM t.departure_time) = 4 THEN 'Jeudi'
        WHEN EXTRACT(DOW FROM t.departure_time) = 5 THEN 'Vendredi'
        WHEN EXTRACT(DOW FROM t.departure_time) = 6 THEN 'Samedi'
    END as day_name_fr,
    t.school_id,
    (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) as booked_seats,
    t.capacity_max - (SELECT COUNT(*) FROM trip_children WHERE trip_id = t.id) as available_seats
FROM trips t
WHERE t.id = 1;  -- REMPLACEZ PAR L'ID DU TRAJET

-- 5. Vérifier tous les trajets récents créés
SELECT 
    t.id,
    t.driver_id,
    t.school_id,
    t.start_point,
    t.end_point,
    t.departure_time,
    t.trip_type,
    t.status,
    t.created_at,
    s.name as school_name,
    u.name as driver_name
FROM trips t
LEFT JOIN schools s ON t.school_id = s.id
LEFT JOIN drivers d ON t.driver_id = d.id
LEFT JOIN users u ON d.user_id = u.id
WHERE t.created_at > NOW() - INTERVAL '7 days'
ORDER BY t.created_at DESC
LIMIT 20;








