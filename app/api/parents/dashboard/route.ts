import { NextRequest, NextResponse } from "next/server";
import {getUserFromRequest} from "@/lib/auth";
import {query} from "@/lib/db";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/parents/dashboard:
 *   get:
 *     summary: Tableau de bord parent
 *     description: "Récupère les statistiques du tableau de bord : trajets à venir, enfants, réservations récentes, etc."
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  try {
    /*  AUTHENTIFICATION */
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "parent") {
      const response = NextResponse.json(
          { success: false, error: "Non autorisé" },
          { status: 401 }
      );
      return setCorsHeaders(response, origin);
    }

    const user_id = user.id;

    /*  TRAJETS À VENIR */
    const upcomingTrips = await query(`
      SELECT 
        t.id as trip_id,
        t.start_point,
        t.end_point,
        t.departure_time,
        t.status,
        u_driver.name as driver_name,
        d.vehicle_plate,
        EXTRACT(EPOCH FROM (t.departure_time - NOW())) / 60 as minutes_until_departure
      FROM trip_children tc
      INNER JOIN children c ON tc.child_id = c.id
      INNER JOIN trips t ON tc.trip_id = t.id
      INNER JOIN drivers d ON t.driver_id = d.id
      INNER JOIN users u_driver ON d.user_id = u_driver.id
      WHERE c.parent_id = $1
        AND t.departure_time > NOW()
        AND t.status IN ('pending', 'in_progress')
      ORDER BY t.departure_time ASC
      LIMIT 10
    `, [user_id]);

    /* STATISTIQUES */
    const stats = await query(`
      SELECT
        COUNT(DISTINCT c.id) AS total_children,
        -- Utiliser le statut global pour les comptages
        COUNT(DISTINCT t.id) FILTER (
            WHERE CASE 
                WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                    get_trip_overall_status(t.status, t.return_status, t.trip_type) = 'completed'
                ELSE
                    t.status = 'completed'
            END
        ) AS completed_trips,
        COUNT(DISTINCT t.id) FILTER (
            WHERE CASE 
                WHEN t.trip_type = 'aller_retour' AND t.return_status IS NOT NULL THEN
                    get_trip_overall_status(t.status, t.return_status, t.trip_type) = 'pending'
                ELSE
                    t.status = 'pending'
            END
        ) AS upcoming_trips,
        COALESCE(SUM(p.amount), 0) AS total_spent
      FROM children c
      LEFT JOIN trip_children tc ON c.id = tc.child_id
      LEFT JOIN trips t ON tc.trip_id = t.id
      LEFT JOIN payments p ON c.parent_id = p.user_id AND p.status = 'paid'
      WHERE c.parent_id = $1
    `, [user_id]);

    /*  NOTIFICATIONS  */
    const notifications = await query(`
      SELECT 
        n.id,
        n.libelle,
        n.type,
        n.description,
        nd.lu,
        n.date_creation
      FROM notification_destinataires nd
      INNER JOIN notifications n ON nd.notification_id = n.id
      WHERE nd.destinataire_id = $1
      ORDER BY n.date_creation DESC
      LIMIT 5
    `, [user_id]);

    /* RÉPONSE FINALE */
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user_id,
          name: user.name,
          email: user.email,
          role: "parent"
        },
        upcomingTrips: upcomingTrips.rows.map(trip => ({
          ...trip,
          minutes_until_departure: Math.round(trip.minutes_until_departure)
        })),
        stats: stats.rows[0],
        notifications: notifications.rows,
        timestamp: new Date().toISOString()
      }
    });
    return setCorsHeaders(response, origin);

  } catch (error) {
    console.error("Erreur dashboard parent:", error);
    const errorResponse = NextResponse.json(
        { success: false, error: "Erreur serveur" },
        { status: 500 }
    );
    return setCorsHeaders(errorResponse, origin);
  }
}
