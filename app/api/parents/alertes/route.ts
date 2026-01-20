import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/parents/alertes:
 *   get:
 *     summary: Envoyer des rappels avant chaque trajet prévu
 *     tags: [CRON]
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        // Sécurité : Vérifier que la requête vient d'un cron autorisé
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

        if (authHeader !== `Bearer ${cronSecret}`) {
            const response = NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        console.log(' Cron job - Vérification des trajets à rappeler...');

        // 1. Rappels à envoyer (par exemple 2 jours avant le départ)
        const remindersResult = await query(`
            SELECT 
                t.id as trip_id,
                t.departure_time,
                t.start_point,
                t.end_point,
                u.id as parent_id,
                u.name,
                u.email,
                u.phone
            FROM trips t
            JOIN trip_children tc ON t.id = tc.trip_id
            JOIN children c ON tc.child_id = c.id
            JOIN users u ON c.parent_id = u.id
            LEFT JOIN notifications n 
                ON n.type = 'trip_reminder' 
                AND n.emetteur_id = t.driver_id 
                AND n.send_at::DATE = (t.departure_time - INTERVAL '2 days')::DATE
                AND n.sent = false
            WHERE t.departure_time::DATE > CURRENT_DATE
              AND n.id IS NULL
        `);

        console.log(`📧 ${remindersResult.rowCount} trajets à rappeler trouvés`);

        for (const trip of remindersResult.rows) {
            const sendAt = new Date(trip.departure_time);
            sendAt.setDate(sendAt.getDate() - 2); // 2 jours avant le trajet

            // Créer la notification
            const notifResult = await query(
                `INSERT INTO notifications (libelle, type, description, emetteur_id, send_at)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id`,
                [
                    'Rappel trajet à venir',
                    'trip_reminder',
                    `Rappel : un trajet est prévu le ${trip.departure_time.toLocaleString()} de ${trip.start_point} à ${trip.end_point}.`,
                    trip.parent_id, // émetteur = parent ou driver
                    sendAt
                ]
            );

            // Associer le parent destinataire
            await query(
                `INSERT INTO notification_destinataires (notification_id, destinataire_id)
                 VALUES ($1, $2)`,
                [notifResult.rows[0].id, trip.parent_id]
            );

            console.log(` Rappel créé pour ${trip.name} (trip_id=${trip.trip_id})`);
        }

        const response = NextResponse.json({
            success: true,
            message: "Rappels des trajets créés avec succès",
            count: remindersResult.rowCount
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur cron trip reminders:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

/**
 * Fonction pour tester manuellement (endpoint admin)
 */
export async function POST(request: NextRequest) {
    return GET(request);
}
