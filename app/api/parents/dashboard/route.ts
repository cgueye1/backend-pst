import { NextRequest, NextResponse } from "next/server";
import {getUserFromRequest} from "@/lib/auth";
import {query} from "@/lib/db";

/**
 * @swagger
 * /api/parents/dashboard:
 *   get:
 *     summary: Tableau de bord parent
 *     tags: [Parents]
 *     security:
 *       - BearerAuth: []
 */
export async function GET(req: NextRequest) {
  try {
    /*  AUTHENTIFICATION */
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "parent") {
      return NextResponse.json(
          { success: false, error: "Non autorisé" },
          { status: 401 }
      );
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
        COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') AS completed_trips,
        COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') AS upcoming_trips,
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
    return NextResponse.json({
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

  } catch (error) {
    console.error("Erreur dashboard parent:", error);
    return NextResponse.json(
        { success: false, error: "Erreur serveur" },
        { status: 500 }
    );
  }
}
