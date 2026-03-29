/**
 * Utilitaires pour calculer le statut global d'un trajet
 * Combine status (aller) et return_status (retour)
 */

export type TripStatus = 'pending' | 'in_progress' | 'completed' | 'canceled';
export type ReturnStatus = 'pending' | 'in_progress' | 'completed' | 'canceled' | null;
export type TripType = 'aller' | 'retour' | 'aller_retour';
export type OverallStatus = 'pending' | 'in_progress' | 'completed' | 'canceled' | 'partially_completed';

/**
 * Calcule le statut global d'un trajet en combinant status (aller) et return_status (retour)
 * 
 * @param status - Statut de l'aller
 * @param returnStatus - Statut du retour (null si pas de retour)
 * @param tripType - Type de trajet
 * @returns Statut global du trajet
 */
export function getTripOverallStatus(
    status: TripStatus,
    returnStatus: ReturnStatus,
    tripType: TripType
): OverallStatus {
    // Si c'est un trajet aller-retour
    if (tripType === 'aller_retour' && returnStatus !== null) {
        // Si l'aller est annulé OU le retour est annulé → trajet annulé
        if (status === 'canceled' || returnStatus === 'canceled') {
            return 'canceled';
        }

        // Si l'aller ET le retour sont terminés → trajet complété
        if (status === 'completed' && returnStatus === 'completed') {
            return 'completed';
        }

        // Si l'aller est en cours OU le retour est en cours → trajet en cours
        if (status === 'in_progress' || returnStatus === 'in_progress') {
            return 'in_progress';
        }

        // Si l'aller est terminé mais le retour n'est pas encore démarré → partiellement complété
        if (status === 'completed' && returnStatus === 'pending') {
            return 'partially_completed';
        }

        // Sinon → en attente
        return 'pending';
    } else {
        // Trajet simple (pas aller-retour) → utiliser directement status
        return status || 'pending';
    }
}

/**
 * Vérifie si un trajet est actif (en cours)
 */
export function isTripActive(
    status: TripStatus,
    returnStatus: ReturnStatus,
    tripType: TripType
): boolean {
    const overallStatus = getTripOverallStatus(status, returnStatus, tripType);
    return overallStatus === 'in_progress';
}

/**
 * Vérifie si un trajet est complété
 */
export function isTripCompleted(
    status: TripStatus,
    returnStatus: ReturnStatus,
    tripType: TripType
): boolean {
    const overallStatus = getTripOverallStatus(status, returnStatus, tripType);
    return overallStatus === 'completed';
}

/**
 * Vérifie si un trajet est annulé
 */
export function isTripCanceled(
    status: TripStatus,
    returnStatus: ReturnStatus,
    tripType: TripType
): boolean {
    const overallStatus = getTripOverallStatus(status, returnStatus, tripType);
    return overallStatus === 'canceled';
}

/**
 * Retourne un libellé lisible du statut global
 */
export function getOverallStatusLabel(overallStatus: OverallStatus): string {
    const labels: Record<OverallStatus, string> = {
        'pending': 'En attente',
        'in_progress': 'En cours',
        'completed': 'Terminé',
        'canceled': 'Annulé',
        'partially_completed': 'Partiellement terminé (aller terminé, retour en attente)'
    };
    return labels[overallStatus] || 'Inconnu';
}

/**
 * Retourne un libellé détaillé avec les statuts de l'aller et du retour
 */
export function getDetailedStatusLabel(
    status: TripStatus,
    returnStatus: ReturnStatus,
    tripType: TripType
): string {
    if (tripType === 'aller_retour' && returnStatus !== null) {
        const statusLabels: Record<TripStatus, string> = {
            'pending': 'En attente',
            'in_progress': 'En cours',
            'completed': 'Terminé',
            'canceled': 'Annulé'
        };

        const returnStatusLabels: Partial<Record<Exclude<ReturnStatus, null>, string>> & { [key: string]: string } = {
            'pending': 'En attente',
            'in_progress': 'En cours',
            'completed': 'Terminé',
            'canceled': 'Annulé'
        };

        const returnStatusLabel = returnStatus === null
            ? 'N/A'
            : (returnStatusLabels[returnStatus] || 'Inconnu');

        return `Aller: ${statusLabels[status]}, Retour: ${returnStatusLabel}`;
    } else {
        const statusLabels: Record<TripStatus, string> = {
            'pending': 'En attente',
            'in_progress': 'En cours',
            'completed': 'Terminé',
            'canceled': 'Annulé'
        };
        return statusLabels[status] || 'Inconnu';
    }
}

