import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/parents/reservations/{tripId}/{childId}:
 *   delete:
 *     summary: Annuler une réservation
 *     description: Permet à un parent d’annuler la réservation de son enfant pour un trajet donné
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string; childId: string }> }
) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { tripId, childId } = await params;
        const user_id = user.id;

        /* 1️⃣ Vérifier que l’enfant appartient au parent */
        const childCheck = await query(
            `SELECT id FROM children WHERE id = $1 AND parent_id = $2`,
            [childId, user_id]
        );

        if (childCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 403 }
            );
        }

        /* 2️⃣ Vérifier le trajet */
        const tripCheck = await query(
            `SELECT departure_time, status FROM trips WHERE id = $1`,
            [tripId]
        );

        if (tripCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Trajet introuvable" },
                { status: 404 }
            );
        }

        const trip = tripCheck.rows[0];

        // Vérifier que le trajet n'est pas dans le passé
        if (new Date(trip.departure_time) < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Impossible d'annuler un trajet déjà passé",
                },
                { status: 400 }
            );
        }

        if (trip.status === "in_progress" || trip.status === "completed") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Impossible d'annuler un trajet déjà commencé ou terminé",
                },
                { status: 400 }
            );
        }

        /* 3️⃣ Supprimer la réservation */
        const deleteResult = await query(
            `DELETE FROM trip_children 
       WHERE trip_id = $1 AND child_id = $2 
       RETURNING *`,
            [tripId, childId]
        );

        if (deleteResult.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Réservation introuvable" },
                { status: 404 }
            );
        }

        /* 4️⃣ Notifier le chauffeur */
        const driverResult = await query(
            `
      SELECT u.id AS driver_user_id
      FROM trips t
      INNER JOIN drivers d ON t.driver_id = d.id
      INNER JOIN users u ON d.user_id = u.id
      WHERE t.id = $1
      `,
            [tripId]
        );

        if (driverResult.rows.length > 0) {
            const notif = await query(
                `
        INSERT INTO notifications (libelle, type, description, emetteur_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
                [
                    "Réservation annulée",
                    "booking_cancelled",
                    `Une réservation a été annulée pour le trajet du ${new Date(
                        trip.departure_time
                    ).toLocaleDateString("fr-FR")}`,
                    user_id,
                ]
            );

            await query(
                `
        INSERT INTO notification_destinataires (notification_id, destinataire_id)
        VALUES ($1, $2)
        `,
                [notif.rows[0].id, driverResult.rows[0].driver_user_id]
            );
        }

        return NextResponse.json({
            success: true,
            message: "Réservation annulée avec succès",
        });
    } catch (error) {
        console.error("Erreur annulation réservation :", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
