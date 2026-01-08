import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
/**
 * @swagger
 * /api/parents/trips/{tripId}/realtime::
 *   get:
 *     summary: Suivre un trajet
 *     tags: [Parent]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string }> }
) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 401 }
            );
        }
        console.log("USER OBJECT:", user);


        const { tripId } = await params;
        const user_id = user.id;
        console.log("USER ID:", user.user_id);
        console.log("TRIP ID:", tripId);

        // Vérifier que le parent a un enfant dans ce trajet
        const verification = await query(
            `
                SELECT 1
                FROM trip_children tc
                         INNER JOIN children c ON tc.child_id = c.id
                WHERE tc.trip_id = $1 AND c.parent_id = $2
            `,
            [tripId, user_id]
        );

        if (verification.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Non autorisé à suivre ce trajet" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                tripId,
                realtime: true
            }
        });
    } catch (error) {
        console.error("Erreur realtime trip:", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
