/**
 * Service pour gérer les notifications liées aux trajets
 * Notifie les parents quand le chauffeur démarre/termine un trajet
 */

import { query } from "@/lib/db";

export interface TripNotificationOptions {
    tripId: number;
    driverId: number;
    direction: 'aller' | 'retour';
    action: 'started' | 'completed' | 'canceled';
    startPoint?: string;
    endPoint?: string;
}

/**
 * Notifie tous les parents d'un trajet
 */
export async function notifyParentsAboutTrip(
    options: TripNotificationOptions
): Promise<{ success: boolean; notifiedCount: number; errors: string[] }> {
    const { tripId, driverId, direction, action, startPoint, endPoint } = options;
    
    const errors: string[] = [];
    let notifiedCount = 0;

    try {
        // Récupérer tous les parents concernés par ce trajet
        const parentsResult = await query(
            `SELECT
                DISTINCT u.id as parent_id,
                u.name as parent_name,
                u.email as parent_email,
                u.phone as parent_phone,
                json_agg(
                    json_build_object(
                        'child_id', c.id,
                        'child_name', c.name
                    )
                ) as children
            FROM trip_children tc
            JOIN children c ON tc.child_id = c.id
            JOIN users u ON c.parent_id = u.id
            WHERE tc.trip_id = $1
            GROUP BY u.id, u.name, u.email, u.phone`,
            [tripId]
        );

        if (parentsResult.rows.length === 0) {
            console.warn(`⚠️ Aucun parent trouvé pour le trajet ${tripId}`);
            return { success: true, notifiedCount: 0, errors: [] };
        }

        // Déterminer le message selon l'action et la direction
        const directionText = direction === 'retour' ? 'retour' : 'aller';
        let libelle = '';
        let type = '';
        let descriptionTemplate = '';

        switch (action) {
            case 'started':
                libelle = `Trajet ${directionText} démarré`;
                type = 'trip_started';
                descriptionTemplate = `Le trajet ${directionText} a commencé`;
                break;
            case 'completed':
                libelle = `Trajet ${directionText} terminé`;
                type = 'trip_completed';
                descriptionTemplate = `Le trajet ${directionText} est terminé. Votre enfant est arrivé à destination en toute sécurité.`;
                break;
            case 'canceled':
                libelle = `Trajet ${directionText} annulé`;
                type = 'trip_canceled';
                descriptionTemplate = `Le trajet ${directionText} a été annulé`;
                break;
        }

        // Ajouter les points de départ/arrivée si disponibles
        if (startPoint || endPoint) {
            if (direction === 'retour') {
                descriptionTemplate += ` de ${endPoint || 'l\'école'} vers ${startPoint || 'votre domicile'}`;
            } else {
                descriptionTemplate += ` de ${startPoint || 'votre domicile'} vers ${endPoint || 'l\'école'}`;
            }
        }

        // Créer une notification personnalisée pour chaque parent
        for (const parent of parentsResult.rows) {
            try {
                const childrenNames = parent.children.map((child: any) => child.child_name);
                
                // Personnaliser le message selon le nombre d'enfants
                let description = descriptionTemplate;
                if (action === 'started') {
                    if (childrenNames.length === 1) {
                        description = `Le trajet ${directionText} pour ${childrenNames[0]} a commencé`;
                    } else if (childrenNames.length === 2) {
                        description = `Le trajet ${directionText} pour ${childrenNames[0]} et ${childrenNames[1]} a commencé`;
                    } else {
                        const lastChild = childrenNames[childrenNames.length - 1];
                        const otherChildren = childrenNames.slice(0, -1).join(', ');
                        description = `Le trajet ${directionText} pour ${otherChildren} et ${lastChild} a commencé`;
                    }
                    if (startPoint) {
                        description += ` vers ${startPoint}`;
                    }
                } else if (action === 'completed') {
                    if (childrenNames.length === 1) {
                        description = `${childrenNames[0]} est arrivé(e) à destination (trajet ${directionText}) en toute sécurité`;
                    } else if (childrenNames.length === 2) {
                        description = `${childrenNames[0]} et ${childrenNames[1]} sont arrivé(e)s à destination (trajet ${directionText}) en toute sécurité`;
                    } else {
                        const lastChild = childrenNames[childrenNames.length - 1];
                        const otherChildren = childrenNames.slice(0, -1).join(', ');
                        description = `${otherChildren} et ${lastChild} sont arrivé(e)s à destination (trajet ${directionText}) en toute sécurité`;
                    }
                }

                // Créer la notification
                const notifResult = await query(
                    `INSERT INTO notifications (libelle, type, description, emetteur_id)
                     VALUES ($1, $2, $3, $4)
                     RETURNING id`,
                    [libelle, type, description, driverId]
                );

                const notificationId = notifResult.rows[0].id;

                // Associer le parent comme destinataire
                await query(
                    `INSERT INTO notification_destinataires (notification_id, destinataire_id, lu)
                     VALUES ($1, $2, false)`,
                    [notificationId, parent.parent_id]
                );

                notifiedCount++;
                console.log(`✅ Notification "${libelle}" envoyée à ${parent.parent_name} (ID: ${parent.parent_id})`);

            } catch (error: any) {
                const errorMsg = `Erreur notification parent ${parent.parent_id}: ${error.message}`;
                errors.push(errorMsg);
                console.error(`❌ ${errorMsg}`, error);
            }
        }

        console.log(`✅ ${notifiedCount} parent(s) notifié(s) pour le trajet ${tripId} (${action}, ${direction})`);

        return {
            success: errors.length === 0,
            notifiedCount,
            errors
        };

    } catch (error: any) {
        const errorMsg = `Erreur lors de la notification des parents: ${error.message}`;
        console.error(`❌ ${errorMsg}`, error);
        return {
            success: false,
            notifiedCount,
            errors: [errorMsg, ...errors]
        };
    }
}

