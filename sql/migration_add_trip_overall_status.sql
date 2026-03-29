-- Migration: Ajouter une fonction pour calculer le statut global d'un trajet
-- Le statut global combine status (aller) et return_status (retour)

BEGIN;

-- Fonction pour calculer le statut global d'un trajet
CREATE OR REPLACE FUNCTION get_trip_overall_status(
    p_status VARCHAR(20),
    p_return_status VARCHAR(20),
    p_trip_type VARCHAR(20)
) RETURNS VARCHAR(20) AS $$
BEGIN
    -- Si c'est un trajet aller-retour
    IF p_trip_type = 'aller_retour' AND p_return_status IS NOT NULL THEN
        -- Si l'aller est annulé OU le retour est annulé → trajet annulé
        IF p_status = 'canceled' OR p_return_status = 'canceled' THEN
            RETURN 'canceled';
        END IF;
        
        -- Si l'aller ET le retour sont terminés → trajet complété
        IF p_status = 'completed' AND p_return_status = 'completed' THEN
            RETURN 'completed';
        END IF;
        
        -- Si l'aller est en cours OU le retour est en cours → trajet en cours
        IF p_status = 'in_progress' OR p_return_status = 'in_progress' THEN
            RETURN 'in_progress';
        END IF;
        
        -- Si l'aller est terminé mais le retour n'est pas encore démarré → trajet partiellement complété
        IF p_status = 'completed' AND p_return_status = 'pending' THEN
            RETURN 'partially_completed';
        END IF;
        
        -- Sinon → en attente
        RETURN 'pending';
    ELSE
        -- Trajet simple (pas aller-retour) → utiliser directement status
        RETURN COALESCE(p_status, 'pending');
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Créer une vue pour faciliter les requêtes avec le statut global
CREATE OR REPLACE VIEW trips_with_overall_status AS
SELECT 
    t.*,
    get_trip_overall_status(t.status, t.return_status, t.trip_type) as overall_status
FROM trips t;

-- Fonction helper pour filtrer par statut global dans les WHERE clauses
CREATE OR REPLACE FUNCTION trip_matches_overall_status(
    p_status VARCHAR(20),
    p_return_status VARCHAR(20),
    p_trip_type VARCHAR(20),
    p_desired_status VARCHAR(20)
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_trip_overall_status(p_status, p_return_status, p_trip_type) = p_desired_status;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION trip_matches_overall_status IS 'Vérifie si le statut global d''un trajet correspond au statut désiré';

-- Commentaires
COMMENT ON FUNCTION get_trip_overall_status IS 'Calcule le statut global d''un trajet en combinant status (aller) et return_status (retour)';
COMMENT ON VIEW trips_with_overall_status IS 'Vue des trajets avec leur statut global calculé';

COMMIT;

