import {NextRequest, NextResponse} from "next/server";
import {getUserFromRequest} from "@/lib/auth";
import {query} from "@/lib/db";

/**
 * @swagger
 * /api/parents/children-trips:
 *   get:
 *     summary: Gérer les enfants et leurs trajets associés
 *     tags: [Parents]
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const result = await query(
            `
      SELECT 
        c.id as child_id,
        c.name as child_name,
        c.address as child_address,
        c.created_at,
        
        -- École
        s.id as school_id,
        s.name as school_name,
        s.address as school_address,
        
        -- Trajets actifs de cet enfant
        json_agg(
          DISTINCT jsonb_build_object(
            'trip_id', t.id,
            'departure_time', t.departure_time,
            'status', t.status,
            'driver_name', u_driver.name,
            'start_point', t.start_point,
            'end_point', t.end_point,
            'is_recurring', t.is_recurring
          )
        ) FILTER (WHERE t.id IS NOT NULL AND t.departure_time > NOW()) as upcoming_trips,
        
        -- Statistiques
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_trips_count,
        COUNT(DISTINCT CASE WHEN t.status = 'pending' AND t.departure_time > NOW() THEN t.id END) as upcoming_trips_count
        
      FROM children c
      LEFT JOIN schools s ON c.school_id = s.id
      LEFT JOIN trip_children tc ON c.id = tc.child_id
      LEFT JOIN trips t ON tc.trip_id = t.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN users u_driver ON d.user_id = u_driver.id
      
      WHERE c.parent_id = $1
      
      GROUP BY c.id, s.id
      ORDER BY c.name
      `,
            [user.id]
        );

        return NextResponse.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Erreur récupération enfants-trajets:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
